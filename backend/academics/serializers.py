
from rest_framework import serializers

from .models import (
    AcademicYear,
    SchoolClass,
    Section,
    Subject,
    ClassSubject,
)
from rest_framework import serializers

from teacher.models import TeacherSubjectAllocation,Teacher
from django.db import transaction
from rest_framework import serializers

from django.db import transaction




class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = [
            "id",
            "name",
            "start_date",
            "end_date",
            "is_active",
        ]


class SchoolClassSerializer(serializers.ModelSerializer):
    academic_year_id = serializers.PrimaryKeyRelatedField(
        source="academic_year",
        queryset=AcademicYear.objects.all()
    )

    academic_year_name = serializers.CharField(
        source="academic_year.name",
        read_only=True
    )

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
            "academic_year_id",
            "academic_year_name",
            "display_order",
        ]

class SectionSerializer(serializers.ModelSerializer):
    school_class_id = serializers.PrimaryKeyRelatedField(
        source="school_class",
        queryset=SchoolClass.objects.all()
    )

    school_class_name = serializers.CharField(
        source="school_class.name",
        read_only=True
    )

    class Meta:
        model = Section
        fields = [
            "id",
            "name",
            "school_class_id",
            "school_class_name",
            "capacity",
        ]
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "code",
            "is_active",
        ]


class ClassSubjectSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )

    subject_code = serializers.CharField(
        source="subject.code",
        read_only=True,
    )

    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True,
    )

    class Meta:
        model = ClassSubject
        fields = [
            "id",
            "school_class",
            "class_name",
            "subject",
            "subject_name",
            "subject_code",
            "is_optional",
        ]



class BulkTeacherSubjectAllocationSerializer(serializers.Serializer):
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all()
    )
    school_class = serializers.PrimaryKeyRelatedField(
        queryset=SchoolClass.objects.all()
    )
    section = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all()
    )
    subjects = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.filter(is_active=True),
        many=True,
        allow_empty=True,
    )

    def validate(self, attrs):
        teacher = attrs["teacher"]
        school_class = attrs["school_class"]
        section = attrs["section"]
        subjects = attrs["subjects"]

        # Section must belong to the selected class
        if section.school_class_id != school_class.id:
            raise serializers.ValidationError({
                "section": "Selected section does not belong to this class."
            })

        # Prevent duplicate subject IDs in the same request
        subject_ids = [subject.id for subject in subjects]

        if len(subject_ids) != len(set(subject_ids)):
            raise serializers.ValidationError({
                "subjects": "Duplicate subject IDs were submitted."
            })

        # Every selected subject must already be assigned to this class
        allowed_subject_ids = set(
            ClassSubject.objects.filter(
                school_class=school_class,
                subject_id__in=subject_ids,
            ).values_list("subject_id", flat=True)
        )

        invalid_subject_ids = set(subject_ids) - allowed_subject_ids

        if invalid_subject_ids:
            raise serializers.ValidationError({
                "subjects": (
                    "Assign these subjects to the selected class first: "
                    f"{sorted(invalid_subject_ids)}"
                )
            })

        # Teacher must have an active linked user
        if not teacher.user_id or not teacher.user.is_active:
            raise serializers.ValidationError({
                "teacher": "Teacher must have an active linked user account."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        teacher = validated_data["teacher"]
        school_class = validated_data["school_class"]
        section = validated_data["section"]
        subjects = validated_data["subjects"]

        # Find subjects already assigned to this exact teacher/class/section
        existing_ids = set(
            TeacherSubjectAllocation.objects.filter(
                teacher=teacher,
                school_class=school_class,
                section=section,
            ).values_list("subject_id", flat=True)
        )

        # Create only missing allocations; preserve existing assignments
        new_allocations = [
            TeacherSubjectAllocation(
                teacher=teacher,
                school_class=school_class,
                section=section,
                subject=subject,
            )
            for subject in subjects
            if subject.id not in existing_ids
        ]

        if new_allocations:
            TeacherSubjectAllocation.objects.bulk_create(new_allocations)

        # Return the complete assignment group
        return list(
            TeacherSubjectAllocation.objects.filter(
                teacher=teacher,
                school_class=school_class,
                section=section,
            ).select_related(
                "teacher",
                "school_class",
                "section",
                "subject",
            ).order_by("subject__name")
        )



class TeacherSubjectAllocationSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(
        source="teacher.name",
        read_only=True,
    )
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )
    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True,
    )
    section_name = serializers.CharField(
        source="section.name",
        read_only=True,
    )

    class Meta:
        model = TeacherSubjectAllocation
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "school_class",
            "class_name",
            "section",
            "section_name",
            "subject",
            "subject_name",
        ]

    def validate(self, attrs):
        school_class = attrs.get(
            "school_class",
            getattr(self.instance, "school_class", None),
        )
        section = attrs.get(
            "section",
            getattr(self.instance, "section", None),
        )
        subject = attrs.get(
            "subject",
            getattr(self.instance, "subject", None),
        )
        teacher = attrs.get(
            "teacher",
            getattr(self.instance, "teacher", None),
        )

        if (
            section
            and school_class
            and section.school_class_id != school_class.id
        ):
            raise serializers.ValidationError({
                "section": "Selected section does not belong to the selected class."
            })

        if (
            subject
            and school_class
            and not ClassSubject.objects.filter(
                school_class=school_class,
                subject=subject,
            ).exists()
        ):
            raise serializers.ValidationError({
                "subject": "Assign this subject to the class first."
            })

        if teacher and not teacher.user_id:
            raise serializers.ValidationError({
                "teacher": "The selected teacher has no linked user account."
            })

        if teacher and not teacher.user.is_active:
            raise serializers.ValidationError({
                "teacher": "The selected teacher account is inactive."
            })

        return attrs

