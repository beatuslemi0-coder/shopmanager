import json
import urllib.request
import urllib.error

from app.core.config import settings


def send_otp_email(to_email: str, otp: str) -> None:
    """
    Hutuma OTP ya kubadilisha password kupitia MailerSend API.
    """

    # Hakikisha API token na email ya mtumaji zimewekwa.
    if not settings.API_TOKEN:
        raise RuntimeError("API_TOKEN haijawekwa.")

    if not settings.MAILERSEND_FROM_EMAIL:
        raise RuntimeError("MAILERSEND_FROM_EMAIL haijawekwa.")

    # Maudhui ya email ya kumtumia mtumiaji.
    email_data = {
        "from": {
            "email": settings.MAILERSEND_FROM_EMAIL,
            "name": "SHOPMANAGER",
        },
        "to": [
            {
                "email": to_email,
            }
        ],
        "subject": "SHOPMANAGER - Password Reset Code",
        "text": (
            "Habari,\n\n"
            "Code yako ya kubadilisha password ya SHOPMANAGER ni:\n\n"
            f"{otp}\n\n"
            "Code hii itaisha baada ya dakika 10.\n"
            "Usimpe mtu mwingine code hii.\n\n"
            "Ikiwa hukuomba kubadilisha password, "
            "puuza email hii.\n\n"
            "Asante,\nSHOPMANAGER"
        ),
    }

    # Geuza taarifa kuwa JSON.
    request_data = json.dumps(email_data).encode("utf-8")

    # Tengeneza ombi la kutuma email kupitia MailerSend.
    request = urllib.request.Request(
        url="https://api.mailersend.com/v1/email",
        data=request_data,
        headers={
            "Authorization": f"Bearer {settings.API_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "SHOPMANAGER/1.0",
        },
        method="POST",
    )

    try:
        # Tuma ombi kwa MailerSend.
        with urllib.request.urlopen(request, timeout=20) as response:
            if not 200 <= response.status < 300:
                raise RuntimeError(
                    f"MailerSend imerudisha HTTP {response.status}."
                )

    except urllib.error.HTTPError as error:
        # Soma maelezo ya hitilafu bila kufichua API token.
        error_body = error.read().decode(
            "utf-8",
            errors="replace",
        )

        raise RuntimeError(
            f"MailerSend API imeshindwa. "
            f"HTTP {error.code}: {error_body}"
        ) from error

    except urllib.error.URLError as error:
        # Tatizo la kuunganisha na huduma.
        raise RuntimeError(
            f"Imeshindwa kuunganisha na MailerSend: {error.reason}"
        ) from error