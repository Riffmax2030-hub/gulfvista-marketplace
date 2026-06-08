"""
Agent Service for gulfvista.properties.
Handles agent profiles, verification, and performance metrics.
"""

import logging
from typing import Optional, List
from datetime import datetime, UTC, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import User, UserRole, Lead, Property, AgentStats, LeadStatus

logger = logging.getLogger(__name__)


class AgentServiceException(Exception):
    """Exception raised during agent operations."""
    pass


class AgentService:
    """
    Service for managing agent profiles and performance metrics.
    Calculates and caches agent statistics.
    """

    def __init__(self, db: Session):
        """
        Initialize agent service.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def verify_agent(self, agent_id: int) -> User:
        """
        Verify an agent account (mark as verified after payment).

        Args:
            agent_id: ID of user to verify as agent

        Returns:
            Updated User object

        Raises:
            AgentServiceException: If user not found or not pending agent
        """
        try:
            user = self.db.query(User).filter(User.id == agent_id).first()
            if not user:
                raise AgentServiceException(f"User {agent_id} not found")

            # Update user role to verified agent
            user.is_agent_verified = True
            user.role = UserRole.AGENT_ADMIN

            # Create empty stats record
            existing_stats = self.db.query(AgentStats).filter(
                AgentStats.agent_id == agent_id
            ).first()

            if not existing_stats:
                stats = AgentStats(
                    agent_id=agent_id,
                    total_listings=0,
                    active_listings=0,
                    total_leads=0,
                    converted_leads=0,
                    pending_leads=0,
                    response_time_hours=0.0,
                    conversion_rate=0.0,
                    average_deal_value=None,
                )
                self.db.add(stats)

            self.db.commit()
            logger.info(f"✅ Agent {agent_id} verified")

            return user

        except AgentServiceException:
            raise
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error verifying agent: {e}")
            raise AgentServiceException(f"Failed to verify agent: {str(e)}")

    def calculate_agent_stats(self, agent_id: int) -> AgentStats:
        """
        Calculate and update agent performance statistics.

        Args:
            agent_id: ID of agent

        Returns:
            Updated AgentStats object
        """
        try:
            # Get or create stats record
            stats = self.db.query(AgentStats).filter(
                AgentStats.agent_id == agent_id
            ).first()

            if not stats:
                stats = AgentStats(agent_id=agent_id)
                self.db.add(stats)

            # Calculate listings
            total_listings = self.db.query(func.count(Property.id)).filter(
                Property.owner_id == agent_id
            ).scalar() or 0

            active_listings = self.db.query(func.count(Property.id)).filter(
                Property.owner_id == agent_id,
                Property.is_active == True,
            ).scalar() or 0

            # Calculate leads
            total_leads = self.db.query(func.count(Lead.id)).filter(
                Lead.agent_id == agent_id
            ).scalar() or 0

            converted_leads = self.db.query(func.count(Lead.id)).filter(
                Lead.agent_id == agent_id,
                Lead.status == LeadStatus.CONVERTED,
            ).scalar() or 0

            pending_leads = self.db.query(func.count(Lead.id)).filter(
                Lead.agent_id == agent_id,
                Lead.status.in_([
                    LeadStatus.NEW,
                    LeadStatus.CONTACTED,
                    LeadStatus.INTERESTED,
                ]),
            ).scalar() or 0

            # Calculate conversion rate
            conversion_rate = (
                (converted_leads / total_leads * 100) if total_leads > 0 else 0
            )

            # Calculate average deal value
            avg_value = self.db.query(
                func.avg(Lead.conversion_value)
            ).filter(
                Lead.agent_id == agent_id,
                Lead.status == LeadStatus.CONVERTED,
                Lead.conversion_value.isnot(None),
            ).scalar()

            # Calculate response time (hours from inquiry to first contact)
            response_times = self.db.query(Lead.last_contacted_at, Lead.inquiry_date).filter(
                Lead.agent_id == agent_id,
                Lead.last_contacted_at.isnot(None),
            ).all()

            if response_times:
                total_hours = sum(
                    (contacted - inquiry_date).total_seconds() / 3600
                    for contacted, inquiry_date in response_times
                    if inquiry_date and contacted
                )
                avg_response_time = total_hours / len(response_times)
            else:
                avg_response_time = 0.0

            # Update stats
            stats.total_listings = total_listings
            stats.active_listings = active_listings
            stats.total_leads = total_leads
            stats.converted_leads = converted_leads
            stats.pending_leads = pending_leads
            stats.conversion_rate = round(conversion_rate, 2)
            stats.average_deal_value = avg_value
            stats.response_time_hours = round(avg_response_time, 2)
            stats.last_updated = datetime.now(UTC)

            self.db.commit()
            logger.info(f"📊 Updated stats for agent {agent_id}")

            return stats

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error calculating agent stats: {e}")
            raise AgentServiceException(f"Failed to calculate stats: {str(e)}")

    def get_agent_profile(self, agent_id: int) -> dict:
        """
        Get complete agent profile with stats.

        Args:
            agent_id: ID of agent

        Returns:
            Dictionary with user and stats data
        """
        try:
            user = self.db.query(User).filter(User.id == agent_id).first()
            if not user:
                raise AgentServiceException(f"Agent {agent_id} not found")

            stats = self.db.query(AgentStats).filter(
                AgentStats.agent_id == agent_id
            ).first()

            if not stats:
                # Calculate if not cached
                stats = self.calculate_agent_stats(agent_id)

            return {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "company_name": user.company_name,
                "company_logo_url": user.company_logo_url,
                "bio": user.bio,
                "is_verified": user.is_agent_verified,
                "stats": {
                    "total_listings": stats.total_listings,
                    "active_listings": stats.active_listings,
                    "total_leads": stats.total_leads,
                    "converted_leads": stats.converted_leads,
                    "pending_leads": stats.pending_leads,
                    "conversion_rate": stats.conversion_rate,
                    "avg_response_time_hours": stats.response_time_hours,
                    "avg_deal_value": stats.average_deal_value,
                },
                "created_at": user.created_at.isoformat(),
            }

        except AgentServiceException:
            raise
        except Exception as e:
            logger.error(f"Error retrieving agent profile: {e}")
            raise AgentServiceException(f"Failed to retrieve profile: {str(e)}")

    def get_top_agents(self, limit: int = 10) -> List[dict]:
        """
        Get top agents by conversion rate.

        Args:
            limit: Max results

        Returns:
            List of agent profile dictionaries
        """
        try:
            top_agents = self.db.query(User, AgentStats).join(
                AgentStats, User.id == AgentStats.agent_id
            ).filter(
                User.is_agent_verified == True,
            ).order_by(
                AgentStats.conversion_rate.desc()
            ).limit(limit).all()

            result = []
            for user, stats in top_agents:
                result.append({
                    "id": user.id,
                    "name": user.full_name,
                    "company_name": user.company_name,
                    "conversion_rate": stats.conversion_rate,
                    "total_leads": stats.total_leads,
                    "converted_leads": stats.converted_leads,
                    "listings": stats.total_listings,
                })

            logger.info(f"📊 Retrieved top {len(result)} agents")
            return result

        except Exception as e:
            logger.error(f"Error retrieving top agents: {e}")
            return []

    def get_agents_by_status(self, status: str = "active") -> List[User]:
        """
        Get agents by verification status.

        Args:
            status: 'verified', 'pending', or 'all'

        Returns:
            List of User objects
        """
        try:
            query = self.db.query(User).filter(
                User.role.in_([UserRole.AGENT_PENDING, UserRole.AGENT_ADMIN])
            )

            if status == "verified":
                query = query.filter(User.is_agent_verified == True)
            elif status == "pending":
                query = query.filter(User.is_agent_verified == False)

            agents = query.order_by(User.created_at.desc()).all()
            logger.info(f"📊 Retrieved {len(agents)} {status} agents")

            return agents

        except Exception as e:
            logger.error(f"Error retrieving agents: {e}")
            return []

    def bulk_update_stats(self) -> dict:
        """
        Update stats for all agents (usually run as background job).

        Returns:
            Dictionary with update statistics
        """
        try:
            agents = self.db.query(User).filter(
                User.is_agent_verified == True
            ).all()

            stats = {
                "updated_count": 0,
                "error_count": 0,
                "agents_processed": len(agents),
            }

            for agent in agents:
                try:
                    self.calculate_agent_stats(agent.id)
                    stats["updated_count"] += 1
                except Exception as e:
                    logger.error(f"Error updating stats for agent {agent.id}: {e}")
                    stats["error_count"] += 1

            logger.info(f"✅ Bulk stats update complete: {stats}")
            return stats

        except Exception as e:
            logger.error(f"Error during bulk stats update: {e}")
            raise AgentServiceException(f"Bulk update failed: {str(e)}")

    def get_performance_summary(self) -> dict:
        """
        Get overall agent network performance summary.

        Returns:
            Dictionary with network-wide stats
        """
        try:
            verified_agents = self.db.query(func.count(User.id)).filter(
                User.is_agent_verified == True
            ).scalar() or 0

            pending_agents = self.db.query(func.count(User.id)).filter(
                User.is_agent_verified == False,
                User.role.in_([UserRole.AGENT_PENDING, UserRole.AGENT_ADMIN]),
            ).scalar() or 0

            total_listings = self.db.query(func.count(Property.id)).filter(
                Property.owner_id.isnot(None)
            ).scalar() or 0

            total_leads = self.db.query(func.count(Lead.id)).scalar() or 0

            converted_leads = self.db.query(func.count(Lead.id)).filter(
                Lead.status == LeadStatus.CONVERTED
            ).scalar() or 0

            overall_conversion_rate = (
                (converted_leads / total_leads * 100) if total_leads > 0 else 0
            )

            return {
                "verified_agents": verified_agents,
                "pending_agents": pending_agents,
                "total_listings": total_listings,
                "total_leads": total_leads,
                "converted_leads": converted_leads,
                "network_conversion_rate": round(overall_conversion_rate, 2),
            }

        except Exception as e:
            logger.error(f"Error calculating performance summary: {e}")
            return {
                "verified_agents": 0,
                "pending_agents": 0,
                "total_listings": 0,
                "total_leads": 0,
                "converted_leads": 0,
                "network_conversion_rate": 0,
            }
