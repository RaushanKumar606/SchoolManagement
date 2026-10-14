from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .UserSignupSerializer import UserSignupSerializer

from .serializers import (
    AdminSchoolClassSerializer,
    AdminSectionSerializer,
    CustomTokenObtainPairSerializer,
)



from .models import User
from academics.models import SchoolClass, Section


User = get_user_model()


# =========================================================
# SCHOOL CLASS
# =========================================================

class AdminSchoolClassListView(generics.ListAPIView):
    queryset = SchoolClass.objects.all().order_by("name")
    serializer_class = AdminSchoolClassSerializer
    permission_classes = [IsAuthenticated]


# =========================================================
# SECTION
# =========================================================

class AdminSectionListView(generics.ListAPIView):
    serializer_class = AdminSectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Section.objects
            .select_related("school_class")
            .order_by(
                "school_class__name",
                "name",
            )
        )

        school_class = self.request.query_params.get("school_class")

        if school_class:
            queryset = queryset.filter(
                school_class_id=school_class
            )

        return queryset


# =========================================================
# USER SIGNUP
# =========================================================

class UserSignupView(generics.CreateAPIView):
    serializer_class = UserSignupSerializer
    permission_classes = [AllowAny]


# =========================================================
# JWT LOGIN
# =========================================================

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# =========================================================
# VALIDATE CREDENTIALS
# =========================================================

class ValidateCredentialsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        username = str(
            request.data.get("username", "")
        ).strip()

        password = request.data.get("password")

        # -------------------------------------------------
        # Required fields
        # -------------------------------------------------

        if not username or not password:
            return Response(
                {
                    "valid": False,
                    "message": "Both username and password are required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # Find user case-insensitively
        # -------------------------------------------------

        user_obj = (
            User.objects
            .filter(username__iexact=username)
            .first()
        )

        if not user_obj:
            return Response(
                {
                    "valid": False,
                    "message": f"User '{username}' does not exist.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # -------------------------------------------------
        # Authenticate
        # -------------------------------------------------

        user = authenticate(
            request=request,
            username=user_obj.username,
            password=password,
        )

        if user is None:
            return Response(
                {
                    "valid": False,
                    "message": "Invalid password.",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # -------------------------------------------------
        # Active account check
        # -------------------------------------------------

        if not user.is_active:
            return Response(
                {
                    "valid": False,
                    "message": "Account is disabled.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # -------------------------------------------------
        # Valid credentials
        # -------------------------------------------------

        return Response(
            {
                "valid": True,
                "message": "Credentials are valid.",
                "user_id": user.id,
                "username": user.username,
                "role": getattr(user, "role", None),
            },
            status=status.HTTP_200_OK,
        )


# =========================================================
# CHANGE PASSWORD
# =========================================================

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        # -------------------------------------------------
        # Required fields
        # -------------------------------------------------

        if not current_password or not new_password:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Current password and new password "
                        "are required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        # -------------------------------------------------
        # Check current password
        # -------------------------------------------------

        if not user.check_password(current_password):
            return Response(
                {
                    "success": False,
                    "message": "Current password is incorrect.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # New password must be different
        # -------------------------------------------------

        if current_password == new_password:
            return Response(
                {
                    "success": False,
                    "message": (
                        "New password must be different "
                        "from current password."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # Minimum password length
        # -------------------------------------------------

        if len(new_password) < 8:
            return Response(
                {
                    "success": False,
                    "message": (
                        "New password must be at least "
                        "8 characters long."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # Save new password
        # -------------------------------------------------

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {
                "success": True,
                "message": "Password changed successfully.",
            },
            status=status.HTTP_200_OK,
        )