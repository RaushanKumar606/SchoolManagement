from django.db import models


class AdmissionApplication(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        REVIEWING = "REVIEWING", "Reviewing"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    # Student Information
    student_first_name = models.CharField(max_length=100)
    student_middle_name = models.CharField(
        max_length=100,
        blank=True
    )
    student_last_name = models.CharField(max_length=100)

    date_of_birth = models.DateField()

    GENDER_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
        ("OTHER", "Other"),
    ]

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    # Academic Information
    applying_for_class = models.CharField(max_length=50)

    previous_school = models.CharField(
        max_length=200,
        blank=True
    )

    # Parent Information
    father_name = models.CharField(max_length=150)

    mother_name = models.CharField(max_length=150)

    parent_phone = models.CharField(max_length=15)

    parent_email = models.EmailField()

    # Address
    address = models.TextField()

    city = models.CharField(max_length=100)

    state = models.CharField(max_length=100)

    postal_code = models.CharField(max_length=10)

    # Application
    message = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    application_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.application_number:

            last_id = (
                AdmissionApplication.objects
                .order_by("-id")
                .values_list("id", flat=True)
                .first()
            )

            next_id = (last_id or 0) + 1

            self.application_number = (
                f"ADM-{next_id:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.application_number} - "
            f"{self.student_first_name} "
            f"{self.student_last_name}"
        )