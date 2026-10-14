from rest_framework import serializers

from .models import (
    Timetable,
    AcademicYear,
    SchoolClass,
    Section,
    Subject,
)

from teacher.models import Teacher


class TimetableSerializer(serializers.ModelSerializer):

    academic_year_name = serializers.CharField(
        source="academic_year.name",
        read_only=True
    )

    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True
    )

    section_name = serializers.CharField(
        source="section.name",
        read_only=True
    )

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True
    )

    subject_code = serializers.CharField(
        source="subject.code",
        read_only=True
    )

    teacher_name = serializers.CharField(
        source="teacher.name",
        read_only=True,
        allow_null=True
    )

    employee_id = serializers.CharField(
        source="teacher.employee_id",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Timetable

        fields = [
            "id",

            "academic_year",
            "academic_year_name",

            "school_class",
            "class_name",

            "section",
            "section_name",

            "subject",
            "subject_name",
            "subject_code",

            "teacher",
            "teacher_name",
            "employee_id",

            "day",
            "start_time",
            "end_time",

            "room_number",
            "is_active",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        academic_year = attrs.get(
            "academic_year"
        )

        school_class = attrs.get(
            "school_class"
        )

        section = attrs.get(
            "section"
        )

        subject = attrs.get(
            "subject"
        )

        teacher = attrs.get(
            "teacher"
        )

        start_time = attrs.get(
            "start_time"
        )

        end_time = attrs.get(
            "end_time"
        )

        day = attrs.get(
            "day"
        )

        # -----------------------------------------
        # CLASS / SECTION VALIDATION
        # -----------------------------------------

        if (
            section
            and school_class
            and section.school_class_id
            != school_class.id
        ):
            raise serializers.ValidationError(
                {
                    "section":
                    "Selected section does not belong to this class."
                }
            )

        # -----------------------------------------
        # ACADEMIC YEAR VALIDATION
        # -----------------------------------------

        if (
            school_class
            and academic_year
            and school_class.academic_year_id
            != academic_year.id
        ):
            raise serializers.ValidationError(
                {
                    "academic_year":
                    "Selected class does not belong to this academic year."
                }
            )

        # -----------------------------------------
        # SUBJECT VALIDATION
        # -----------------------------------------

        if (
            school_class
            and subject
            and not school_class.class_subjects.filter(
                subject=subject
            ).exists()
        ):
            raise serializers.ValidationError(
                {
                    "subject":
                    "This subject is not assigned to the selected class."
                }
            )

        # -----------------------------------------
        # TEACHER ALLOCATION VALIDATION
        # -----------------------------------------

        if teacher:
            from teacher.models import TeacherSubjectAllocation

            allocation_exists = (
                TeacherSubjectAllocation.objects.filter(
                    teacher=teacher,
                    school_class=school_class,
                    section=section,
                    subject=subject,
                ).exists()
            )

            if not allocation_exists:
                raise serializers.ValidationError(
                    {
                        "teacher":
                        "This teacher is not assigned to this class, section and subject."
                    }
                )

        # -----------------------------------------
        # TIME VALIDATION
        # -----------------------------------------

        if start_time and end_time:

            if start_time >= end_time:
                raise serializers.ValidationError(
                    {
                        "end_time":
                        "End time must be later than start time."
                    }
                )

        # -----------------------------------------
        # DUPLICATE SLOT VALIDATION
        # -----------------------------------------

        timetable_id = (
            self.instance.id
            if self.instance
            else None
        )

        duplicate = Timetable.objects.filter(
            academic_year=academic_year,
            school_class=school_class,
            section=section,
            day=day,
            start_time=start_time,
            end_time=end_time,
        )

        if timetable_id:
            duplicate = duplicate.exclude(
                id=timetable_id
            )

        if duplicate.exists():
            raise serializers.ValidationError(
                {
                    "timetable":
                    "A timetable already exists for this class, section and time slot."
                }
            )

        return attrs