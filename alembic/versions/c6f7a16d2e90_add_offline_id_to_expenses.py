from alembic import op
import sqlalchemy as sa


revision = "c6f7a16d2e90"
down_revision = "82b0d7626cdb"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "expenses",
        sa.Column("offline_id", sa.String(length=36), nullable=True),
    )
    op.create_index(
        op.f("ix_expenses_offline_id"),
        "expenses",
        ["offline_id"],
        unique=True,
    )


def downgrade():
    op.drop_index(op.f("ix_expenses_offline_id"), table_name="expenses")
    op.drop_column("expenses", "offline_id")
