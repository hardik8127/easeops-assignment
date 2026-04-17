import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings


def send_email(to: str, subject: str, html_body: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.EMAILS_FROM
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAILS_FROM, to, msg.as_string())


def send_welcome_email(to: str, name: str) -> None:
    subject = "Welcome to EaseOps E-Library!"
    body = f"""
    <h2>Welcome, {name}!</h2>
    <p>Your account has been created successfully. Start exploring our eBook library.</p>
    <p>Happy reading!</p>
    """
    send_email(to, subject, body)


def send_new_book_notification(to: str, book_title: str, book_author: str) -> None:
    subject = f"New eBook Available: {book_title}"
    body = f"""
    <h2>New eBook Added!</h2>
    <p><strong>{book_title}</strong> by {book_author} is now available in the library.</p>
    <p>Log in to start reading.</p>
    """
    send_email(to, subject, body)
