from django.db import models


class AcademicYear(models.Model):

    name = models.CharField(
        max_length=20,
        unique=True
    )

    start_date = models.DateField()
    end_date = models.DateField()

    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class SchoolClass(models.Model):
    name = models.CharField(
        max_length=100
    )

    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name="school_classes"
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return self.name


class Section(models.Model):
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="sections"
    )

    name = models.CharField(
        max_length=50
    )

    capacity = models.PositiveIntegerField(
        default=40
    )

    def __str__(self):
        return f"{self.school_class.name} - {self.name}"

class Subject(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )
    code = models.CharField(
        max_length=20,
        unique=True
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class ClassSubject(models.Model):
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="class_subjects"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="class_subjects"
    )

    is_optional = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["school_class", "subject"],
                name="unique_class_subject"
            )
        ]

    def __str__(self):
        return f"{self.school_class.name} - {self.subject.name}"


class Timetable(models.Model):

    class DayOfWeek(models.TextChoices):
        MONDAY = "MONDAY", "Monday"
        TUESDAY = "TUESDAY", "Tuesday"
        WEDNESDAY = "WEDNESDAY", "Wednesday"
        THURSDAY = "THURSDAY", "Thursday"
        FRIDAY = "FRIDAY", "Friday"
        SATURDAY = "SATURDAY", "Saturday"

    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name="timetables"
    )

    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="timetables"
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="timetables"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name="timetables"
    )

    teacher = models.ForeignKey(
        "teacher.Teacher",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="timetables"
    )

    day = models.CharField(
        max_length=15,
        choices=DayOfWeek.choices
    )

    start_time = models.TimeField()
    end_time = models.TimeField()

    room_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["day", "start_time"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "academic_year",
                    "school_class",
                    "section",
                    "day",
                    "start_time",
                    "end_time",
                ],
                name="unique_section_timetable_slot"
            )
        ]

    def __str__(self):
        return (
            f"{self.school_class.name} - "
            f"{self.section.name} - "
            f"{self.day} - "
            f"{self.subject.name}"
        )
