"""Initial schema with all models - Phases 1-5

Revision ID: 001_initial
Revises:
Create Date: 2026-05-20 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create Enums
    userole_enum = postgresql.ENUM('buyer', 'seller', 'agent_pending', 'agent_admin', name='userrole')
    propertytype_enum = postgresql.ENUM('apartment', 'villa', 'townhouse', 'land', 'commercial', 'office', name='propertytype')
    paymentstatus_enum = postgresql.ENUM('pending', 'completed', 'failed', 'refunded', name='paymentstatus')
    leadstatus_enum = postgresql.ENUM('new', 'contacted', 'interested', 'negotiating', 'converted', 'lost', 'cancelled', name='leadstatus')
    agentstatus_enum = postgresql.ENUM('active', 'inactive', 'suspended', 'onboarding', name='agentstatus')
    leadsource_enum = postgresql.ENUM('web_form', 'property_inquiry', 'reelly_webhook', 'manual', name='leadsource')

    userole_enum.create(op.get_bind())
    propertytype_enum.create(op.get_bind())
    paymentstatus_enum.create(op.get_bind())
    leadstatus_enum.create(op.get_bind())
    agentstatus_enum.create(op.get_bind())
    leadsource_enum.create(op.get_bind())

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('role', userole_enum, nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=True),
        sa.Column('company_logo_url', sa.String(length=500), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('is_agent_verified', sa.Boolean(), nullable=False),
        sa.Column('stripe_customer_id', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_superuser', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('stripe_customer_id'),
    )
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_role', 'users', ['role'])

    # Create properties table
    op.create_table(
        'properties',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('property_type', propertytype_enum, nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('price_per_sqft', sa.Float(), nullable=True),
        sa.Column('address', sa.String(length=500), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('emirate', sa.String(length=100), nullable=False),
        sa.Column('country', sa.String(length=100), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('bedrooms', sa.Integer(), nullable=True),
        sa.Column('bathrooms', sa.Integer(), nullable=True),
        sa.Column('area_sqft', sa.Float(), nullable=True),
        sa.Column('year_built', sa.Integer(), nullable=True),
        sa.Column('furnishing', sa.String(length=50), nullable=True),
        sa.Column('images', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('video_url', sa.String(length=500), nullable=True),
        sa.Column('floor_plans', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('developer_name', sa.String(length=255), nullable=True),
        sa.Column('project_name', sa.String(length=255), nullable=True),
        sa.Column('developer_logo_url', sa.String(length=500), nullable=True),
        sa.Column('source_id', sa.String(length=255), nullable=True),
        sa.Column('source_platform', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_featured', sa.Boolean(), nullable=False),
        sa.Column('views_count', sa.Integer(), nullable=False),
        sa.Column('owner_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('source_id'),
    )
    op.create_index('ix_properties_owner_id', 'properties', ['owner_id'])
    op.create_index('ix_properties_source_id', 'properties', ['source_id'])
    op.create_index('ix_properties_type', 'properties', ['property_type'])
    op.create_index('ix_properties_price', 'properties', ['price'])

    # Create transactions table
    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('stripe_session_id', sa.String(length=255), nullable=False),
        sa.Column('stripe_payment_intent_id', sa.String(length=255), nullable=True),
        sa.Column('amount_cents', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('transaction_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=False),
        sa.Column('status', paymentstatus_enum, nullable=False),
        sa.Column('idempotency_key', sa.String(length=255), nullable=True),
        sa.Column('payment_metadata', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('stripe_session_id'),
        sa.UniqueConstraint('stripe_payment_intent_id'),
        sa.UniqueConstraint('idempotency_key'),
    )
    op.create_index('ix_transactions_user_id', 'transactions', ['user_id'])
    op.create_index('ix_transactions_status', 'transactions', ['status'])
    op.create_index('ix_transactions_created_at', 'transactions', ['created_at'])

    # Create property_sync_logs table (Phase 5)
    op.create_table(
        'property_sync_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sync_type', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('total_processed', sa.Integer(), nullable=False),
        sa.Column('created_count', sa.Integer(), nullable=False),
        sa.Column('updated_count', sa.Integer(), nullable=False),
        sa.Column('deleted_count', sa.Integer(), nullable=False),
        sa.Column('error_details', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_property_sync_logs_status', 'property_sync_logs', ['status'])
    op.create_index('ix_property_sync_logs_created_at', 'property_sync_logs', ['created_at'])

    # Create agent_stats table (Phase 5)
    op.create_table(
        'agent_stats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('agent_id', sa.Integer(), nullable=False),
        sa.Column('total_listings', sa.Integer(), nullable=False),
        sa.Column('active_listings', sa.Integer(), nullable=False),
        sa.Column('total_leads', sa.Integer(), nullable=False),
        sa.Column('converted_leads', sa.Integer(), nullable=False),
        sa.Column('pending_leads', sa.Integer(), nullable=False),
        sa.Column('response_time_hours', sa.Float(), nullable=False),
        sa.Column('conversion_rate', sa.Float(), nullable=False),
        sa.Column('average_deal_value', sa.Float(), nullable=True),
        sa.Column('last_updated', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('agent_id'),
    )
    op.create_index('ix_agent_stats_agent_id', 'agent_stats', ['agent_id'])
    op.create_index('ix_agent_stats_updated_at', 'agent_stats', ['last_updated'])

    # Create reely_webhooks table (Phase 5)
    op.create_table(
        'reely_webhooks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('reely_event_id', sa.String(length=255), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('payload', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('processed', sa.Boolean(), nullable=False),
        sa.Column('error_details', sa.Text(), nullable=True),
        sa.Column('received_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('reely_event_id'),
    )
    op.create_index('ix_reely_webhooks_event_id', 'reely_webhooks', ['reely_event_id'])
    op.create_index('ix_reely_webhooks_event_type', 'reely_webhooks', ['event_type'])
    op.create_index('ix_reely_webhooks_created_at', 'reely_webhooks', ['received_at'])

    # Create webhook_logs table (Phase 4)
    op.create_table(
        'webhook_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('stripe_event_id', sa.String(length=255), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('payload', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('processed', sa.Boolean(), nullable=False),
        sa.Column('error_details', sa.Text(), nullable=True),
        sa.Column('received_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('stripe_event_id'),
    )
    op.create_index('ix_webhook_logs_event_id', 'webhook_logs', ['stripe_event_id'])
    op.create_index('ix_webhook_logs_event_type', 'webhook_logs', ['event_type'])
    op.create_index('ix_webhook_logs_created_at', 'webhook_logs', ['received_at'])

    # Create invoices table (Phase 4)
    op.create_table(
        'invoices',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('transaction_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('invoice_number', sa.String(length=50), nullable=False),
        sa.Column('amount_cents', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=False),
        sa.Column('pdf_url', sa.String(length=500), nullable=True),
        sa.Column('issued_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['transaction_id'], ['transactions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('invoice_number'),
    )
    op.create_index('ix_invoices_transaction_id', 'invoices', ['transaction_id'])
    op.create_index('ix_invoices_user_id', 'invoices', ['user_id'])
    op.create_index('ix_invoices_created_at', 'invoices', ['created_at'])

    # Create leads table (Enhanced in Phase 5)
    op.create_table(
        'leads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('agent_id', sa.Integer(), nullable=False),
        sa.Column('property_id', sa.Integer(), nullable=False),
        sa.Column('inquirer_name', sa.String(length=255), nullable=False),
        sa.Column('inquirer_email', sa.String(length=255), nullable=False),
        sa.Column('inquirer_phone', sa.String(length=20), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('inquiry_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', leadstatus_enum, nullable=False),
        sa.Column('assigned_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_contacted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('follow_up_count', sa.Integer(), nullable=False),
        sa.Column('converted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('conversion_value', sa.Float(), nullable=True),
        sa.Column('source', leadsource_enum, nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('communication_log', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['agent_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_leads_agent_id', 'leads', ['agent_id'])
    op.create_index('ix_leads_property_id', 'leads', ['property_id'])
    op.create_index('ix_leads_status', 'leads', ['status'])
    op.create_index('ix_leads_created_at', 'leads', ['created_at'])
    op.create_index('ix_leads_inquirer_email', 'leads', ['inquirer_email'])


def downgrade() -> None:
    # Drop all indexes and tables in reverse order
    op.drop_index('ix_leads_inquirer_email', table_name='leads')
    op.drop_index('ix_leads_created_at', table_name='leads')
    op.drop_index('ix_leads_status', table_name='leads')
    op.drop_index('ix_leads_property_id', table_name='leads')
    op.drop_index('ix_leads_agent_id', table_name='leads')
    op.drop_table('leads')

    op.drop_index('ix_invoices_created_at', table_name='invoices')
    op.drop_index('ix_invoices_user_id', table_name='invoices')
    op.drop_index('ix_invoices_transaction_id', table_name='invoices')
    op.drop_table('invoices')

    op.drop_index('ix_webhook_logs_created_at', table_name='webhook_logs')
    op.drop_index('ix_webhook_logs_event_type', table_name='webhook_logs')
    op.drop_index('ix_webhook_logs_event_id', table_name='webhook_logs')
    op.drop_table('webhook_logs')

    op.drop_index('ix_reely_webhooks_created_at', table_name='reely_webhooks')
    op.drop_index('ix_reely_webhooks_event_type', table_name='reely_webhooks')
    op.drop_index('ix_reely_webhooks_event_id', table_name='reely_webhooks')
    op.drop_table('reely_webhooks')

    op.drop_index('ix_agent_stats_updated_at', table_name='agent_stats')
    op.drop_index('ix_agent_stats_agent_id', table_name='agent_stats')
    op.drop_table('agent_stats')

    op.drop_index('ix_property_sync_logs_created_at', table_name='property_sync_logs')
    op.drop_index('ix_property_sync_logs_status', table_name='property_sync_logs')
    op.drop_table('property_sync_logs')

    op.drop_index('ix_transactions_created_at', table_name='transactions')
    op.drop_index('ix_transactions_status', table_name='transactions')
    op.drop_index('ix_transactions_user_id', table_name='transactions')
    op.drop_table('transactions')

    op.drop_index('ix_properties_price', table_name='properties')
    op.drop_index('ix_properties_type', table_name='properties')
    op.drop_index('ix_properties_source_id', table_name='properties')
    op.drop_index('ix_properties_owner_id', table_name='properties')
    op.drop_table('properties')

    op.drop_index('ix_users_role', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')

    # Drop enums
    sa.Enum('buyer', 'seller', 'agent_pending', 'agent_admin', name='userrole').drop(op.get_bind())
    sa.Enum('apartment', 'villa', 'townhouse', 'land', 'commercial', 'office', name='propertytype').drop(op.get_bind())
    sa.Enum('pending', 'completed', 'failed', 'refunded', name='paymentstatus').drop(op.get_bind())
    sa.Enum('new', 'contacted', 'interested', 'negotiating', 'converted', 'lost', 'cancelled', name='leadstatus').drop(op.get_bind())
    sa.Enum('active', 'inactive', 'suspended', 'onboarding', name='agentstatus').drop(op.get_bind())
    sa.Enum('web_form', 'property_inquiry', 'reelly_webhook', 'manual', name='leadsource').drop(op.get_bind())
