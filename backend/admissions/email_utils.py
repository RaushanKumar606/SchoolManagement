
import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.html import escape
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)


class StudentCredentialEmailError(Exception):
    pass


def send_student_credentials_email(
    student,
    username,
    temporary_password,
):
    parent_email = (student.parent_email or "").strip()

    # Validate parent email
    if not parent_email:
        logger.error(
            "Credential email not sent: parent email missing. Student ID: %s",
            student.student_id,
        )
        raise StudentCredentialEmailError("Parent email is missing.")

    try:
        validate_email(parent_email)
    except ValidationError as exc:
        logger.error(
            "Credential email not sent: invalid parent email. Student ID: %s",
            student.student_id,
        )
        raise StudentCredentialEmailError(
            "Invalid parent email."
        ) from exc

    # Validate frontend login URL
    login_url = getattr(settings, "FRONTEND_LOGIN_URL", "")

    if not login_url:
        logger.error("FRONTEND_LOGIN_URL is missing.")
        raise StudentCredentialEmailError(
            "Frontend login URL is not configured."
        )

    # Validate SMTP configuration without logging secrets
    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
        logger.error("Gmail SMTP credentials are missing.")
        raise StudentCredentialEmailError(
            "Email credentials are not configured."
        )

    student_name = (
        f"{student.first_name} {student.last_name}"
    )

    academic_year = student.academic_year.name
    class_name = student.school_class.name
    section_name = student.section.name

    subject = "Student Admission Approved - Login Credentials"

    text_content = f"""
Dear Parent,

Your child's admission has been approved.

Student Name: {student_name}
Student ID: {student.student_id}
Roll Number: {student.roll_number}
Academic Year: {academic_year}
Class: {class_name}
Section: {section_name}

Username: {username}
Temporary Password: {temporary_password}

Login URL: {login_url}

Please change your temporary password after login.

Regards,
School Administration
"""

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body>
        <h2>Admission Approved!</h2>
        <p>Dear Parent,</p>
        <p>Admission approved for <strong>{escape(student_name)}</strong>.</p>

        <p>Student ID: {escape(student.student_id)}</p>
        <p>Roll Number: {escape(student.roll_number)}</p>
        <p>Academic Year: {escape(academic_year)}</p>
        <p>Class: {escape(class_name)}</p>
        <p>Section: {escape(section_name)}</p>

        <p>Username: <strong>{escape(username)}</strong></p>
        <p>Temporary Password:
            <strong>{escape(temporary_password)}</strong>
        </p>

        <p>
            <a href="{escape(login_url)}">Login to Student Portal</a>
        </p>

        <p>Please change your temporary password after login.</p>
        <p>Regards,<br>School Administration</p>
    </body>
    </html>
    """

    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[parent_email],
        )

        email.attach_alternative(html_content, "text/html")

        sent = email.send(fail_silently=False)

        if sent != 1:
            raise StudentCredentialEmailError(
                "SMTP server did not confirm email submission."
            )

        logger.info(
            "Student credentials email submitted. Student ID: %s",
            student.student_id,
        )

        return True

    except Exception as exc:
        logger.exception(
            "Credential email failed. Student ID: %s",
            student.student_id,
        )

        raise StudentCredentialEmailError(
            "Unable to submit student credentials email."
        ) from exc
