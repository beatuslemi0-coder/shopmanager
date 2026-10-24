import argparse

from sqlalchemy import func

from app.db.session import SessionLocal
from app.models import User


def main():
    parser = argparse.ArgumentParser(
        description="Grant admin access to an existing Shop Manager account."
    )
    parser.add_argument("email", help="Email address of the existing account")
    email = parser.parse_args().email.strip().lower()

    db = SessionLocal()
    try:
        user = db.query(User).filter(func.lower(User.email) == email).first()
        if user is None:
            parser.error(f"No account found for {email}. Register the account first.")
        if not user.is_active:
            parser.error("This account is inactive. Activate it before granting admin access.")
        if user.role == "admin":
            print(f"{user.email} already has admin access.")
            return

        user.role = "admin"
        db.commit()
        print(f"Admin access granted to {user.email}. Sign out and sign in again to see Admin.")
    finally:
        db.close()


if __name__ == "__main__":
    main()