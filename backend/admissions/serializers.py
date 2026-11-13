
from rest_framework import serializers

from .models import AdmissionApplication

from common.supabase_storage import (
    upload_document,
    delete_document,
)


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

            "student_photo",
            "previous_marksheet",
        ]

        read_only_fields = [
            "id",
            "application_number",
            "status",
            "created_at",
        ]

    # Student photo validation
    def validate_student_photo(self, value):

        if value is None:
            return value

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Student photo must be under 5 MB."
            )

        if value.content_type not in [
            "image/jpeg",
            "image/png",
        ]:
            raise serializers.ValidationError(
                "Only JPG and PNG photos are allowed."
            )

        return value

    # Previous marksheet validation
    def validate_previous_marksheet(self, value):

        if value is None:
            return value

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "Marksheet must be under 5 MB."
            )

        if value.content_type != "application/pdf":
            raise serializers.ValidationError(
                "Only PDF marksheets are allowed."
            )

        return value

    # Upload files to Supabase
    def create(self, validated_data):

        photo = validated_data.pop(
            "student_photo", None
        )

        marksheet = validated_data.pop(
            "previous_marksheet", None
        )

        uploaded_paths = []

        try:

            if photo:

                photo_path = upload_document(
                    photo,
                    "admissions/student_photos"
                )

                validated_data["student_photo"] = photo_path

                uploaded_paths.append(photo_path)

            if marksheet:

                marksheet_path = upload_document(
                    marksheet,
                    "admissions/marksheets"
                )

                validated_data["previous_marksheet"] = (
                    marksheet_path
                )

                uploaded_paths.append(marksheet_path)

            admission = AdmissionApplication.objects.create(
                **validated_data
            )

            return admission

        except Exception:

            for path in uploaded_paths:

                try:
                    delete_document(path)

                except Exception:
                    pass

            raise
