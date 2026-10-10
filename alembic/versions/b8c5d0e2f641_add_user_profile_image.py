from alembic import op
import sqlalchemy as sa


revision = "b8c5d0e2f641"
down_revision = "e4f0427b7a44"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("profile_image_url", sa.String(500), nullable=True))


def downgrade():
    op.drop_column("users", "profile_image_url")