from alembic import op
import sqlalchemy as sa

revision = "ff3f6db67c28"
down_revision = "b8c5d0e2f641"
branch_labels = None
depends_on = None


def upgrade():
    # Angalia kama column ipo tayari kwenye database
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = [
        column["name"]
        for column in inspector.get_columns("users")
    ]

    # Ongeza column ikiwa haipo
    if "profile_image_url" not in columns:
        op.add_column(
            "users",
            sa.Column(
                "profile_image_url",
                sa.String(),
                nullable=True
            )
        )


def downgrade():
    # Angalia kama column ipo kabla ya kuiondoa
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = [
        column["name"]
        for column in inspector.get_columns("users")
    ]

    # Ondoa column ikiwa ipo
    if "profile_image_url" in columns:
        op.drop_column("users", "profile_image_url")