
from rest_framework import serializers
from .models import ApplicationSetting


class ApplicationSettingSerializer(serializers.ModelSerializer):

    class Meta:
        model = ApplicationSetting

        fields = [
            "student_admission",
            "teacher_hiring",
            "updated_at",
        ]

        read_only_fields = ["updated_at"]
