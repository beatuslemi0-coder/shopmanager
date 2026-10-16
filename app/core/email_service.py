import json
import urllib.request
import urllib.error

from app.core.config import settings


def send_otp_email(to_email: str, otp: str) -> None:
    """
    Hutuma OTP ya kubadilisha password kupitia Resend API.
    """

    # Hakikisha mipangilio muhimu ipo kabla ya kutuma email.
    if not settings.RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY haijawekwa.")

    if not settings.RESEND_FROM_EMAIL:
        raise RuntimeError("RESEND_FROM_EMAIL haijawekwa.")

    # Maudhui ya email yatakayotumwa kwa mtumiaji.
    email_data = {
        "from": settings.RESEND_FROM_EMAIL,
        "to": [to_email],
        "subject": "SHOPMANAGER - Password Reset Code",
        "text": f"""
Habari,

Code yako ya kubadilisha password ya SHOPMANAGER ni:

{otp}

Code hii itaisha baada ya dakika 10.
Usimpe mtu mwingine code hii.

Ikiwa hukuomba kubadilisha password, puuza email hii.

Asante,
SHOPMANAGER
""",
    }

    # Geuza taarifa za email kuwa JSON inayokubaliwa na API.
    request_data = json.dumps(email_data).encode("utf-8")

    # Tengeneza ombi la kutuma email kupitia Resend API.
    request = urllib.request.Request(
        url="https://api.resend.com/emails",
        data=request_data,
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "SHOPMANAGER/1.0",
        },
        method="POST",
    )

    try:
        # Tuma email na subiri majibu ya API kwa sekunde 20.
        with urllib.request.urlopen(request, timeout=20) as response:

            # Resend ikikubali ombi, email itakuwa imekubaliwa kutumwa.
            if not 200 <= response.status < 300:
                raise RuntimeError(
                    f"Resend imerudisha HTTP {response.status}."
                )

    except urllib.error.HTTPError as error:
        # Soma ujumbe wa hitilafu bila kufichua API key.
        error_body = error.read().decode("utf-8", errors="replace")

        raise RuntimeError(
            f"Resend API imeshindwa. HTTP {error.code}: {error_body}"
        ) from error

    except urllib.error.URLError as error:
        # Tatizo la mtandao au kuunganisha na Resend.
        raise RuntimeError(
            f"Imeshindwa kuunganisha na Resend API: {error.reason}"
        ) from error