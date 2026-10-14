from rest_framework import serializers
from .models import Student
from academics.models import ClassSubject

class AdminStudentSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()

    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True
    )

    section_name = serializers.CharField(
        source="section.name",
        read_only=True
    )

    academic_year_name = serializers.CharField(
        source="academic_year.name",
        read_only=True
    )

    class Meta:
        model = Student

        fields = [
            "id",
            "student_id",
            "student_name",

            "first_name",
            "middle_name",
            "last_name",
            "date_of_birth",
            "gender",

            "academic_year",
            "academic_year_name",

            "school_class",
            "class_name",

            "section",
            "section_name",

            "father_name",
            "mother_name",
            "parent_phone",
            "parent_email",

            "address",
            "city",
            "state",
            "postal_code",

            "is_active",

            "admission_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student_id",
            "admission_date",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        return (
            f"{obj.first_name} "
            f"{obj.middle_name} "
            f"{obj.last_name}"
        ).strip()

class StudentProfileSerializer(serializers.ModelSerializer):

    academic_year = serializers.CharField(
        source="academic_year.name",
        read_only=True
    )

    school_class = serializers.CharField(
        source="school_class.name",
        read_only=True
    )

    section = serializers.CharField(
        source="section.name",
        read_only=True
    )

    class Meta:
        model = Student
        fields = [
            "student_id",
            "first_name",
            "middle_name",
            "last_name",
            "date_of_birth",
            "gender",

            "academic_year",
            "school_class",
            "section",

            "father_name",
            "mother_name",
            "parent_phone",
            "parent_email",

            "address",
            "city",
            "state",
            "postal_code",

            "is_active",
            "admission_date",
        ]


class StudentSubjectSerializer(serializers.ModelSerializer):

    subject_id = serializers.IntegerField(
        source="subject.id",
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

    is_optional = serializers.BooleanField(
        read_only=True
    )

    class Meta:
        model = ClassSubject
        fields = [
            "subject_id",
            "subject_name",
            "subject_code",
            "is_optional",
        ]