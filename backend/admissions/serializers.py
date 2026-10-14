from rest_framework import serializers

from .models import AdmissionApplication


class AdmissionApplicationSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = AdmissionApplication

        fields = [
            "id",
            "application_number",

            "student_first_name",
            "student_middle_name",
            "student_last_name",

            "date_of_birth",
            "gender",

            "applying_for_class",
            "previous_school",

            "father_name",
            "mother_name",

            "parent_phone",
            "parent_email",

            "address",
            "city",
            "state",
            "postal_code",

            "message",

            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "application_number",
            "status",
            "created_at",
        ]