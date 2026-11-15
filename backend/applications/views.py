
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import ApplicationSetting
from .serializers import ApplicationSettingSerializer
from .permissions import IsApplicationSettingsAdmin
from applications.utils import is_student_admission_open

class PublicApplicationSettingsView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        settings = ApplicationSetting.get_settings()

        serializer = ApplicationSettingSerializer(settings)

        return Response(serializer.data)


class AdminApplicationSettingsView(APIView):

    permission_classes = [IsApplicationSettingsAdmin]

    def get(self, request):
        settings = ApplicationSetting.get_settings()

        serializer = ApplicationSettingSerializer(settings)

        return Response(serializer.data)

    def patch(self, request):
        settings = ApplicationSetting.get_settings()

        serializer = ApplicationSettingSerializer(
            settings,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": "Application settings updated successfully.",
            "settings": serializer.data
        })