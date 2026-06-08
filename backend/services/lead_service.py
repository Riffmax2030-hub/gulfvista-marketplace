"""
Lead Service for gulfvista.properties.
Handles lead creation, auto-assignment, and tracking.
"""

import logging
from typing import Optional, List
from datetime import datetime, UTC
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from models import Lead, User, UserRole, LeadStatus, LeadSource
import config

logger = logging.getLogger(__name__)


class LeadServiceException(Exception):
    """Exception raised during lead operations."""
    pass


class LeadService:
    """
    Service for managing leads and inquiries.
    Handles auto-assignment using round-robin algorithm.
    """

    def __init__(self, db: Session):
        """
        Initialize lead service.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db
        self.max_lead_assignment = getattr(
            config,
            "MAX_LEAD_ASSIGNMENT_COUNT",
            10
        )

    def create_lead(
        self,
        property_id: int,
        inquirer_name: str,
        inquirer_email: str,
        inquirer_phone: str,
        message: Optional[str] = None,
        source: LeadSource = LeadSource.PROPERTY_INQUIRY,
        agent_id: Optional[int] = None,
    ) -> Lead:
        """
        Create new lead and auto-assign to agent if needed.

        Args:
            property_id: ID of property being inquired about
            inquirer_name: Name of person making inquiry
            inquirer_email: Email of inquirer
            inquirer_phone: Phone number of inquirer
            message: Optional inquiry message
            source: Source of the lead
            agent_id: Optional specific agent ID (overrides auto-assign)

        Returns:
            Created Lead object

        Raises:
            LeadServiceException: If no agents available or other error
        """
        try:
            # Use provided agent or auto-assign
            if not agent_id:
                agent_id = self._auto_assign_agent()
                if not agent_id:
                    raise LeadServiceException("No available agents for assignment")
                logger.info(f"🤖 Auto-assigned lead to agent {agent_id}")
            else:
                logger.info(f"👤 Lead assigned to agent {agent_id}")

            # Create lead
            lead = Lead(
                property_id=property_id,
                agent_id=agent_id,
                inquirer_name=inquirer_name,
                inquirer_email=inquirer_email,
                inquirer_phone=inquirer_phone,
                message=message,
                inquiry_date=datetime.now(UTC),
                status=LeadStatus.NEW,
                source=source,
                assigned_at=datetime.now(UTC),
                follow_up_count=0,
                communication_log=[],
            )

            self.db.add(lead)
            self.db.commit()

            logger.info(f"✅ Created lead {lead.id} for property {property_id}")
            return lead

        except LeadServiceException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ Error creating lead: {e}")
            raise LeadServiceException(f"Failed to create lead: {str(e)}")

    def _auto_assign_agent(self) -> Optional[int]:
        """
        Auto-assign lead to agent using round-robin algorithm.
        Assigns to agent with fewest pending leads (under max capacity).

        Returns:
            Agent ID or None if no agents available
        """
        try:
            # Get all active agents
            active_agents = self.db.query(User).filter(
                User.role.in_([UserRole.AGENT_PENDING, UserRole.AGENT_ADMIN]),
                User.is_active == True,
            ).all()

            if not active_agents:
                logger.warning("⚠️  No active agents available")
                return None

            # Count pending leads per agent
            agent_lead_counts = {}
            for agent in active_agents:
                pending_count = self.db.query(func.count(Lead.id)).filter(
                    Lead.agent_id == agent.id,
                    Lead.status.in_([
                        LeadStatus.NEW,
                        LeadStatus.CONTACTED,
                        LeadStatus.INTERESTED,
                    ]),
                ).scalar()

                agent_lead_counts[agent.id] = pending_count or 0

            # Filter agents under max capacity
            available_agents = {
                agent_id: count
                for agent_id, count in agent_lead_counts.items()
                if count < self.max_lead_assignment
            }

            if not available_agents:
                logger.warning("⚠️  All agents at capacity")
                return None

            # Assign to agent with fewest leads
            assigned_agent = min(available_agents, key=available_agents.get)
            logger.info(
                f"🤖 Assigning to agent {assigned_agent} "
                f"({available_agents[assigned_agent]} current leads)"
            )

            return assigned_agent

        except Exception as e:
            logger.error(f"Error auto-assigning agent: {e}")
            return None

    def update_lead_status(
        self,
        lead_id: int,
        status: LeadStatus,
        notes: Optional[str] = None,
    ) -> Lead:
        """
        Update lead status with optional notes.

        Args:
            lead_id: ID of lead to update
            status: New LeadStatus
            notes: Optional status notes

        Returns:
            Updated Lead object
        """
        try:
            lead = self.db.query(Lead).filter(Lead.id == lead_id).first()
            if not lead:
                raise LeadServiceException(f"Lead {lead_id} not found")

            lead.status = status
            if notes:
                lead.notes = notes

            self.db.commit()
            logger.info(f"📝 Updated lead {lead_id} status to {status.value}")

            return lead

        except LeadServiceException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating lead status: {e}")
            raise LeadServiceException(f"Failed to update lead: {str(e)}")

    def log_communication(
        self,
        lead_id: int,
        action: str,
        details: Optional[str] = None,
    ) -> Lead:
        """
        Log communication action for a lead.

        Args:
            lead_id: ID of lead
            action: Type of action (contacted, emailed, called, viewed)
            details: Optional action details

        Returns:
            Updated Lead object
        """
        try:
            lead = self.db.query(Lead).filter(Lead.id == lead_id).first()
            if not lead:
                raise LeadServiceException(f"Lead {lead_id} not found")

            # Add to communication log
            if not lead.communication_log:
                lead.communication_log = []

            log_entry = {
                "timestamp": datetime.now(UTC).isoformat(),
                "action": action,
                "details": details,
            }

            lead.communication_log.append(log_entry)
            lead.last_contacted_at = datetime.now(UTC)
            lead.follow_up_count = len(lead.communication_log)

            self.db.commit()
            logger.info(f"📋 Logged {action} for lead {lead_id}")

            return lead

        except LeadServiceException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error logging communication: {e}")
            raise LeadServiceException(f"Failed to log communication: {str(e)}")

    def mark_converted(
        self,
        lead_id: int,
        conversion_value: Optional[float] = None,
    ) -> Lead:
        """
        Mark lead as converted.

        Args:
            lead_id: ID of lead
            conversion_value: Optional deal value

        Returns:
            Updated Lead object
        """
        try:
            lead = self.db.query(Lead).filter(Lead.id == lead_id).first()
            if not lead:
                raise LeadServiceException(f"Lead {lead_id} not found")

            lead.status = LeadStatus.CONVERTED
            lead.converted_at = datetime.now(UTC)
            lead.conversion_value = conversion_value

            self.db.commit()
            logger.info(
                f"💰 Lead {lead_id} marked as converted "
                f"(value: {conversion_value})"
            )

            return lead

        except LeadServiceException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error marking lead as converted: {e}")
            raise LeadServiceException(f"Failed to mark lead converted: {str(e)}")

    def get_agent_leads(
        self,
        agent_id: int,
        status: Optional[LeadStatus] = None,
        limit: int = 50,
    ) -> List[Lead]:
        """
        Get leads assigned to an agent.

        Args:
            agent_id: Agent ID
            status: Optional filter by status
            limit: Max results

        Returns:
            List of Lead objects
        """
        try:
            query = self.db.query(Lead).filter(Lead.agent_id == agent_id)

            if status:
                query = query.filter(Lead.status == status)

            leads = query.order_by(Lead.created_at.desc()).limit(limit).all()
            logger.info(f"📊 Retrieved {len(leads)} leads for agent {agent_id}")

            return leads

        except Exception as e:
            logger.error(f"Error retrieving agent leads: {e}")
            return []

    def get_pending_leads(self, limit: int = 100) -> List[Lead]:
        """
        Get all pending leads (not yet contacted or converted).

        Args:
            limit: Max results

        Returns:
            List of pending Lead objects
        """
        try:
            leads = self.db.query(Lead).filter(
                Lead.status.in_([
                    LeadStatus.NEW,
                    LeadStatus.CONTACTED,
                    LeadStatus.INTERESTED,
                ])
            ).order_by(Lead.created_at.asc()).limit(limit).all()

            logger.info(f"📊 Retrieved {len(leads)} pending leads")
            return leads

        except Exception as e:
            logger.error(f"Error retrieving pending leads: {e}")
            return []

    def reassign_lead(
        self,
        lead_id: int,
        new_agent_id: int,
    ) -> Lead:
        """
        Reassign lead to different agent.

        Args:
            lead_id: ID of lead to reassign
            new_agent_id: New agent ID

        Returns:
            Updated Lead object
        """
        try:
            lead = self.db.query(Lead).filter(Lead.id == lead_id).first()
            if not lead:
                raise LeadServiceException(f"Lead {lead_id} not found")

            old_agent_id = lead.agent_id
            lead.agent_id = new_agent_id
            lead.assigned_at = datetime.now(UTC)

            self.db.commit()
            logger.info(f"🔄 Reassigned lead {lead_id} from agent {old_agent_id} to {new_agent_id}")

            return lead

        except LeadServiceException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error reassigning lead: {e}")
            raise LeadServiceException(f"Failed to reassign lead: {str(e)}")

    def get_lead_stats(self) -> dict:
        """
        Get overall lead statistics.

        Returns:
            Dictionary with lead stats
        """
        try:
            total_leads = self.db.query(func.count(Lead.id)).scalar() or 0
            converted_leads = self.db.query(func.count(Lead.id)).filter(
                Lead.status == LeadStatus.CONVERTED
            ).scalar() or 0
            pending_leads = self.db.query(func.count(Lead.id)).filter(
                Lead.status.in_([
                    LeadStatus.NEW,
                    LeadStatus.CONTACTED,
                    LeadStatus.INTERESTED,
                ])
            ).scalar() or 0

            conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0

            return {
                "total_leads": total_leads,
                "converted_leads": converted_leads,
                "pending_leads": pending_leads,
                "conversion_rate": round(conversion_rate, 2),
            }

        except Exception as e:
            logger.error(f"Error calculating lead stats: {e}")
            return {
                "total_leads": 0,
                "converted_leads": 0,
                "pending_leads": 0,
                "conversion_rate": 0,
            }
