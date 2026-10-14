from rest_framework import serializers
from .models import AdmissionApplication


class AdmissionApplicationAdminSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = AdmissionApplication
        fields = [
            "id",
            "application_number",

            # Student
            "student_first_name",
            "student_middle_name",
            "student_last_name",
            "date_of_birth",
            "gender",
            "applying_for_class",
            "previous_school",

            # Parent
            "father_name",
            "mother_name",
            "parent_phone",
            "parent_email",

            # Address
            "address",
            "city",
            "state",
            "postal_code",

            # Application
            "message",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "application_number",
            "created_at",
            "updated_at",
        ]