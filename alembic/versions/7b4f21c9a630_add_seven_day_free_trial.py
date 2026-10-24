from datetime import datetime, timedelta, timezone

from alembic import op
import sqlalchemy as sa


revision = "7b4f21c9a630"
down_revision = "ede03f3b92e7"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column("trial_expires_at", sa.DateTime(), nullable=True),
    )

    users = sa.table(
        "users",
        sa.column("role", sa.String()),
        sa.column("trial_expires_at", sa.DateTime()),
    )
    rollout_trial_end = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(
        days=7
    )
    op.execute(
        users.update()
        .where(sa.func.lower(users.c.role) != "admin")
        .values(trial_expires_at=rollout_trial_end)
    )


def downgrade():
    op.drop_column("users", "trial_expires_at")
