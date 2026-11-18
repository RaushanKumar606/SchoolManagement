# from django.db import models

# from accounts.models import User
# from admissions.models import AdmissionApplication
# from academics.models import AcademicYear, SchoolClass, Section


# class Student(models.Model):

#     class Gender(models.TextChoices):
#         MALE = "MALE", "Male"
#         FEMALE = "FEMALE", "Female"
#         OTHER = "OTHER", "Other"

#     # Student account
#     user = models.OneToOneField(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="student_profile",
#     )

#     # Admission from which student was created
#     admission = models.OneToOneField(
#         AdmissionApplication,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="student",
#     )

#     # Unique school student ID
#     student_id = models.CharField(
#         max_length=30,
#         unique=True,
#         blank=True,
#     )

#     # Student information
#     first_name = models.CharField(max_length=100)
#     middle_name = models.CharField(
#         max_length=100,
#         blank=True,
#     )
#     last_name = models.CharField(max_length=100)

#     date_of_birth = models.DateField()

#     gender = models.CharField(
#         max_length=10,
#         choices=Gender.choices,
#     )

#     # Academic placement
#     academic_year = models.ForeignKey(
#         AcademicYear,
#         on_delete=models.PROTECT,
#         related_name="students",
#     )

#     school_class = models.ForeignKey(
#         SchoolClass,
#         on_delete=models.PROTECT,
#         related_name="students",
#     )

#     section = models.ForeignKey(
#         Section,
#         on_delete=models.PROTECT,
#         related_name="students",
#     )

#     # Parent information
#     father_name = models.CharField(
#         max_length=150,
#     )

#     mother_name = models.CharField(
#         max_length=150,
#     )

#     parent_phone = models.CharField(
#         max_length=15,
#     )

#     parent_email = models.EmailField()

#     # Address
#     address = models.TextField()

#     city = models.CharField(
#         max_length=100,
#     )

#     state = models.CharField(
#         max_length=100,
#     )

#     postal_code = models.CharField(
#         max_length=10,
#     )

#     is_active = models.BooleanField(
#         default=True,
#     )

#     admission_date = models.DateField(
#         auto_now_add=True,
#     )

#     created_at = models.DateTimeField(
#         auto_now_add=True,
#     )

#     updated_at = models.DateTimeField(
#         auto_now=True,
#     )

#     def save(self, *args, **kwargs):

#         if not self.student_id:
#             last_student = (
#                 Student.objects
#                 .order_by("-id")
#                 .first()
#             )

#             next_id = (
#                 (last_student.id + 1)
#                 if last_student
#                 else 1
#             )

#             self.student_id = f"STU-{next_id:05d}"

#         super().save(*args, **kwargs)

#     def __str__(self):
#         return (
#             f"{self.student_id} - "
#             f"{self.first_name} {self.last_name}"
#         )







from django.db import models
from django.db.models import Q

from accounts.models import User
from admissions.models import AdmissionApplication
from academics.models import AcademicYear, SchoolClass, Section


class RollNumberGenerationLock(models.Model):
    """
    A singleton database row used to serialize roll number generation.
    Row with id=1 must be created through a data migration.
    """
    description = models.CharField(
        max_length=100,
        default="Global student roll number lock",
    )

    def __str__(self):
        return self.description


class ClassRollNumberCounter(models.Model):
    """
    Permanent counter for each class name.
    Academic Year is intentionally excluded.
    """

    class_key = models.CharField(
        max_length=100,
        unique=True,
    )

    last_number = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.class_key}: {self.last_number}"


class Student(models.Model):

    class Gender(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"

    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_profile",
    )

    admission = models.OneToOneField(
        AdmissionApplication,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student",
    )

    student_id = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
    )

    # Permanent class-wise roll number
    roll_number = models.CharField(
        max_length=10,
        null=True,
        blank=True,
    )

    # Normalized class name, independent of academic year
    roll_number_class_key = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        db_index=True,
    )

    first_name = models.CharField(max_length=100)

    middle_name = models.CharField(
        max_length=100,
        blank=True,
    )

    last_name = models.CharField(max_length=100)

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices,
    )

    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name="students",
    )

    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.PROTECT,
        related_name="students",
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.PROTECT,
        related_name="students",
    )

    father_name = models.CharField(max_length=150)

    mother_name = models.CharField(max_length=150)

    parent_phone = models.CharField(max_length=15)

    parent_email = models.EmailField()

    address = models.TextField()

    city = models.CharField(max_length=100)

    state = models.CharField(max_length=100)

    postal_code = models.CharField(max_length=10)

    is_active = models.BooleanField(default=True)

    admission_date = models.DateField(auto_now_add=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "roll_number_class_key",
                    "roll_number",
                ],
                condition=(
                    Q(roll_number_class_key__isnull=False)
                    & Q(roll_number__isnull=False)
                ),
                name="unique_permanent_class_roll_number",
            )
        ]

    def save(self, *args, **kwargs):

        if not self.student_id:
            last_student = (
                Student.objects
                .order_by("-id")
                .first()
            )

            next_id = (
                (last_student.id + 1)
                if last_student
                else 1
            )

            self.student_id = f"STU-{next_id:05d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.student_id} - "
            f"{self.first_name} {self.last_name}"
        )
