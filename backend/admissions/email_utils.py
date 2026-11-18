
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
    parent_email = student.parent_email

    if not parent_email:
        raise StudentCredentialEmailError(
            "Parent email address is missing."
        )

    try:
        validate_email(parent_email)
    except ValidationError as exc:
        raise StudentCredentialEmailError(
            "Invalid parent email address."
        ) from exc

    student_name = (
        f"{student.first_name} {student.last_name}"
    )

    academic_year = student.academic_year.name
    class_name = student.school_class.name
    section_name = student.section.name

    login_url = settings.FRONTEND_LOGIN_URL

    subject = "Student Admission Approved - Login Credentials"

    text_content = f"""
Dear Parent,

Congratulations! Your child's admission has been approved.

Student Details:
Student Name: {student_name}
Student ID: {student.student_id}
Roll Number: {student.roll_number}
Academic Year: {academic_year}
Class: {class_name}
Section: {section_name}

Login Credentials:
Username: {username}
Temporary Password: {temporary_password}

Login URL: {login_url}

Please log in and change the temporary password immediately.

Regards,
School Administration
"""

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:25px;background:#f4f6fa;
                 font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:auto;background:white;
                  border-radius:12px;overflow:hidden;">

        <div style="background:#173b70;color:white;
                    padding:25px;text-align:center;">
          <h2>Admission Approved!</h2>
          <p>Your student's account is ready.</p>
        </div>

        <div style="padding:25px;">

          <p>Dear Parent,</p>

          <p>
            Congratulations! The admission of
            <strong>{escape(student_name)}</strong>
            has been approved.
          </p>

          <h3>Student Details</h3>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td>Student ID</td>
              <td><strong>{escape(student.student_id)}</strong></td>
            </tr>
            <tr>
              <td>Roll Number</td>
              <td><strong>{escape(student.roll_number)}</strong></td>
            </tr>
            <tr>
              <td>Academic Year</td>
              <td>{escape(academic_year)}</td>
            </tr>
            <tr>
              <td>Class</td>
              <td>{escape(class_name)}</td>
            </tr>
            <tr>
              <td>Section</td>
              <td>{escape(section_name)}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{escape(username)}</td>
            </tr>
            <tr>
              <td>Temporary Password</td>
              <td><strong>{escape(temporary_password)}</strong></td>
            </tr>
          </table>

          <div style="text-align:center;margin:30px 0;">
            <a href="{escape(login_url)}"
               style="background:#173b70;color:white;
                      padding:14px 28px;text-decoration:none;
                      border-radius:6px;">
              Login to Student Portal
            </a>
          </div>

          <p style="color:#b45309;">
            Please change your temporary password after logging in.
          </p>

          <p>Regards,<br>School Administration</p>

        </div>
      </div>
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

        email.attach_alternative(
            html_content,
            "text/html",
        )

        sent = email.send(fail_silently=False)

        if sent != 1:
            raise StudentCredentialEmailError(
                "Email server did not confirm submission."
            )

    except Exception as exc:
        logger.exception(
            "Credential email failed for Student ID %s",
            student.student_id,
        )

        raise StudentCredentialEmailError(
            "Unable to send student credentials email."
        ) from exc

    return True
