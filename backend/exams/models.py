
from django.db import models
from django.db import models
from django.core.exceptions import ValidationError

class Exam(models.Model):
    name = models.CharField(max_length=100)

    academic_year = models.ForeignKey(
        "academics.AcademicYear",
        on_delete=models.PROTECT,
        related_name="exams",
    )

    school_class = models.ForeignKey(
        "academics.SchoolClass",
        on_delete=models.PROTECT,
        related_name="exams",
    )

    section = models.ForeignKey(
        "academics.Section",
        on_delete=models.PROTECT,
        related_name="exams",
    )

    start_date = models.DateField()
    end_date = models.DateField()

    is_timetable_published = models.BooleanField(default=False)
    is_result_published = models.BooleanField(default=False)
    is_admit_card_released = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "name",
                    "academic_year",
                    "school_class",
                    "section",
                ],
                name="unique_exam_year_class_section",
            )
        ]

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.school_class_id and self.academic_year_id:
            if self.school_class.academic_year_id != self.academic_year_id:
                raise ValidationError(
                    "Selected class does not belong to this academic year."
                )

        if self.section_id and self.school_class_id:
            if self.section.school_class_id != self.school_class_id:
                raise ValidationError(
                    "Selected section does not belong to this class."
                )

        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValidationError(
                    "End date cannot be before start date."
                )

    def __str__(self):
        return (
            f"{self.name} - {self.school_class.name} "
            f"- {self.section.name}"
        )

class ExamSchedule(models.Model):
    exam = models.ForeignKey(
        "exams.Exam",
        on_delete=models.CASCADE,
        related_name="schedules",
    )

    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.PROTECT,
        related_name="exam_schedules",
    )

    exam_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    total_marks = models.PositiveIntegerField(default=100)
    passing_marks = models.PositiveIntegerField(default=33)

    class Meta:
        ordering = ["exam_date", "start_time"]
        constraints = [
            models.UniqueConstraint(
                fields=["exam", "subject"],
                name="unique_exam_subject_schedule",
            )
        ]

    def clean(self):
        if self.exam_id and self.subject_id:
            from academics.models import ClassSubject

            class_subject_exists = ClassSubject.objects.filter(
                school_class_id=self.exam.school_class_id,
                subject_id=self.subject_id,
            ).exists()

            if not class_subject_exists:
                raise ValidationError({
                    "subject": "This subject is not assigned to the exam's class."
                })

        if self.start_time and self.end_time:
            if self.end_time <= self.start_time:
                raise ValidationError(
                    "End time must be after start time."
                )

        if self.passing_marks > self.total_marks:
            raise ValidationError(
                "Passing marks cannot exceed total marks."
            )

        if self.exam_id and self.exam_date:
            if not (
                self.exam.start_date
                <= self.exam_date
                <= self.exam.end_date
            ):
                raise ValidationError(
                    "Exam date must be within the exam period."
                )

    def __str__(self):
        return (
            f"{self.exam.name} - {self.subject.name} "
            f"- {self.exam_date}"
        )
