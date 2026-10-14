from django.conf import settings
from django.db import models


class TeacherRegistration(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    department = models.CharField(max_length=100)
    primary_subject = models.CharField(max_length=100)
    qualification = models.CharField(max_length=100)

    employee_id = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
        default="Pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.status}"


class Teacher(models.Model):
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_teachers"
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)

    email = models.EmailField(
        unique=True,
        null=True,
        blank=True
    )

    phone = models.CharField(
        max_length=15,
        null=True,
        blank=True
    )

    qualification = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    primary_subject = models.CharField(max_length=100)

    must_change_password = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.primary_subject}"


class TeacherSubjectAllocation(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="assigned_classes"
    )

    school_class = models.ForeignKey(
        "academics.SchoolClass",
        on_delete=models.CASCADE,
        related_name="teacher_allocations"
    )

    section = models.ForeignKey(
        "academics.Section",
        on_delete=models.CASCADE,
        related_name="teacher_allocations"
    )

    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.CASCADE,
        related_name="teacher_allocations"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "teacher",
                    "school_class",
                    "section",
                    "subject",
                ],
                name="unique_teacher_class_section_subject",
            )
        ]

    def __str__(self):
        return (
            f"{self.teacher.name} -> "
            f"{self.school_class.name} "
            f"({self.section.name}) : "
            f"{self.subject.name}"
        )


class Student(models.Model):
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=50, unique=True)
    class_name = models.CharField(max_length=10)
    section = models.CharField(
        max_length=5,
        default="A"
    )
    parent_contact = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    def __str__(self):
        return (
            f"{self.name} "
            f"(Class {self.class_name}-{self.section})"
        )


class Attendance(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )

    date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=[
            ("Present", "Present"),
            ("Absent", "Absent"),
        ]
    )

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attendance_records"
    )

    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="attendance_records"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "student",
                    "date",
                    "subject",
                ],
                name="unique_student_date_subject_attendance"
            )
        ]

    def __str__(self):
        return (
            f"{self.student.student_id} - "
            f"{self.subject.name if self.subject else 'No Subject'} - "
            f"{self.date} - "
            f"{self.status}"
        )

class ExamMark(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="exam_marks"
    )

    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.PROTECT,
        related_name="exam_marks"
    )

    exam_name = models.CharField(max_length=100)

    marks_obtained = models.FloatField()

    total_marks = models.FloatField(default=100)

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="exam_marks"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.student.student_id} - "
            f"{self.subject.name} - "
            f"{self.exam_name} - "
            f"{self.marks_obtained}/{self.total_marks}"
        )

class Assignment(models.Model):
    title = models.CharField(max_length=200)

    description = models.TextField()

    school_class = models.ForeignKey(
        "academics.SchoolClass",
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    section = models.ForeignKey(
        "academics.Section",
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.PROTECT,
        related_name="assignments",
    )

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    due_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.title} - "
            f"{self.school_class.name} - "
            f"{self.section.name} - "
            f"{self.subject.name}"
        )


class AssignmentSubmission(models.Model):
    STATUS_CHOICES = [
        ("Submitted", "Submitted"),
        ("Reviewed", "Reviewed"),
        ("Late", "Late"),
    ]

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="submissions"
    )

    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="assignment_submissions"
    )

    answer_text = models.TextField(
        blank=True,
        null=True
    )

    file = models.FileField(
        upload_to="assignments/submissions/",
        blank=True,
        null=True
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Submitted"
    )

    marks = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    teacher_feedback = models.TextField(
        blank=True,
        null=True
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "student"],
                name="unique_assignment_student_submission"
            )
        ]
        ordering = ["-submitted_at"]

    def __str__(self):
        return (
            f"{self.assignment.title} - "
            f"{self.student.student_id}"
        )


class LeaveRequest(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="leaves"
    )

    from_date = models.DateField()
    to_date = models.DateField()

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
        default="Pending"
    )

    approved_by = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return (
            f"Leave: "
            f"{self.student.name} "
            f"({self.status})"
        )