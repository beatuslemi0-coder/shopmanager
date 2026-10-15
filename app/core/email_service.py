
import smtplib
from email.message import EmailMessage

from app.core.config import settings

def send_otp_email(to_email: str, otp: str) -> None:
    """Tuma OTP ya password reset kupitia Gmail SMTP."""

    message = EmailMessage()
    message["Subject"] = "SHOPMANAGER - Password Reset Code"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = to_email

    message.set_content(
        f"""
Habari,

Code yako ya kubadilisha password ya SHOPMANAGER ni:

{otp}

Code hii itaisha baada ya dakika 10.
Usimpe mtu mwingine code hii.

Ikiwa hukuomba kubadilisha password, puuza email hii.
"""
    )

    # Unganisha Gmail kwa kutumia TLS
    with smtplib.SMTP(
        settings.SMTP_HOST,
        settings.SMTP_PORT,
        timeout=20,
    ) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()

        server.login(
            settings.SMTP_USERNAME,
            settings.SMTP_PASSWORD,
        )

        server.send_message(message)