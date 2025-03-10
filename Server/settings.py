EMAIL_CONFIG = ConnectionConfig(
    MAIL_USERNAME="your-email@gmail.com",
    MAIL_PASSWORD="your-password",
    MAIL_FROM="your-email@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False,
    TEMPLATE_FOLDER=Path(__file__).parent.parent/'templates/'
)
#pip install fastapi-mail python-jose
