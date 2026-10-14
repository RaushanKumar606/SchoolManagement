
from rest_framework import serializers

from .models import (
    AcademicYear,
    SchoolClass,
    Section,
    Subject,
    ClassSubject,
)


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

    academic_year_id = serializers.IntegerField(
        source="academic_year.id",
        read_only=True,
    )

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
            "academic_year_id",
            "display_order",
        ]

class SectionSerializer(serializers.ModelSerializer):

    school_class_id = serializers.IntegerField(
        source="school_class.id",
        read_only=True,
    )

    class Meta:
        model = Section
        fields = [
            "id",
            "name",
            "school_class_id",
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

