from rest_framework import serializers
from .models import AdmissionApplication


class AdmissionStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = AdmissionApplication
        fields = ["status"]

    def validate_status(self, value):

        allowed_statuses = [
            AdmissionApplication.Status.PENDING,
            AdmissionApplication.Status.REVIEWING,
            AdmissionApplication.Status.APPROVED,
            AdmissionApplication.Status.REJECTED,
        ]

        if value not in allowed_statuses:
            raise serializers.ValidationError(
                "Invalid admission status."
            )

        return value