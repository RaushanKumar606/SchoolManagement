from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.models import User
from students.models import Student
from .admin_serializers import AdmissionApplicationAdminSerializer
from .models import AdmissionApplication
from .permissions import IsAdmissionAdmin
from .serializers import AdmissionApplicationSerializer
from .status_serializers import AdmissionStatusSerializer
from .student_creation_serializers import ApproveAdmissionSerializer


import secrets

from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response

from accounts.models import User
from students.models import Student, RollNumberGenerationLock

from students.roll_number_utils import generate_class_roll_number

from admissions.email_utils import (
    send_student_credentials_email,
    StudentCredentialEmailError,
)




from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from students.models import Student

from .admin_serializers import AdmissionApplicationAdminSerializer
from .models import AdmissionApplication
from .permissions import IsAdmissionAdmin
from .serializers import AdmissionApplicationSerializer
from .status_serializers import AdmissionStatusSerializer
from .student_creation_serializers import ApproveAdmissionSerializer

from common.supabase_storage import create_document_signed_url
from applications.utils import is_student_admission_open


from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)

import secrets

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    BasePermission,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from students.models import Student, RollNumberGenerationLock
from students.roll_number_utils import generate_class_roll_number

from admissions.email_utils import (
    send_student_credentials_email,
    StudentCredentialEmailError,
)



class AdmissionApplicationCreateView(generics.CreateAPIView):

    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionApplicationSerializer

    permission_classes = [AllowAny]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def create(self, request, *args, **kwargs):

        if not is_student_admission_open():
            return Response(
                {
                    "success": False,
                    "message": (
                        "Student admission applications are currently closed."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().create(request, *args, **kwargs)



class AdmissionApplicationListView(generics.ListAPIView):
    queryset = AdmissionApplication.objects.all().order_by("-created_at")
    serializer_class = AdmissionApplicationAdminSerializer
    permission_classes = [IsAdmissionAdmin]


class AdmissionApplicationDetailView(generics.RetrieveAPIView):
    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionApplicationAdminSerializer
    permission_classes = [IsAdmissionAdmin]


class AdmissionApplicationStatusView(generics.UpdateAPIView):
    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionStatusSerializer
    permission_classes = [IsAdmissionAdmin]

# --------------------------------------------------
# 5. APPROVE ADMISSION AND CREATE STUDENT
# --------------------------------------------------

# class ApproveAdmissionView(generics.GenericAPIView):

#     queryset = AdmissionApplication.objects.all()
#     serializer_class = ApproveAdmissionSerializer
#     permission_classes = [IsAdmissionAdmin]

#     @transaction.atomic
#     def post(self, request, pk):

#         admission = self.get_object()

#         # Prevent duplicate student creation
#         if hasattr(admission, "student"):
#             return Response(
#                 {
#                     "detail": (
#                         "This admission application has already "
#                         "been converted to a student."
#                     )
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Validate request data first
#         serializer = self.get_serializer(data=request.data)

#         if not serializer.is_valid():
#             return Response(
#                 serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         data = serializer.validated_data

#         # Generate unique username
#         username = f"student{admission.id:05d}"

#         if User.objects.filter(username=username).exists():
#             return Response(
#                 {
#                     "detail": (
#                         f"Student username '{username}' already exists."
#                     )
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Temporary password
#         temporary_password = f"Student@{admission.id}123"

#         # Update admission status
#         admission.status = AdmissionApplication.Status.APPROVED
#         admission.save(update_fields=["status", "updated_at"])

#         # Create user
#         user = User.objects.create_user(
#             username=username,
#             password=temporary_password,
#             first_name=admission.student_first_name,
#             last_name=admission.student_last_name,
#             email=admission.parent_email,
#             phone=admission.parent_phone,
#             role=User.Role.STUDENT,
#             is_active=True,
#         )

#         # Create student
#         student = Student.objects.create(
#             user=user,
#             admission=admission,
#             first_name=admission.student_first_name,
#             middle_name=admission.student_middle_name,
#             last_name=admission.student_last_name,
#             date_of_birth=admission.date_of_birth,
#             gender=admission.gender,
#             academic_year=data["academic_year"],
#             school_class=data["school_class"],
#             section=data["section"],
#             father_name=admission.father_name,
#             mother_name=admission.mother_name,
#             parent_phone=admission.parent_phone,
#             parent_email=admission.parent_email,
#             address=admission.address,
#             city=admission.city,
#             state=admission.state,
#             postal_code=admission.postal_code,
#             is_active=True,
#         )

#         student_id_value = getattr(
#             student,
#             "student_id",
#             student.id,
#         )

#         return Response(
#             {
#                 "message": (
#                     "Admission approved and student login "
#                     "created successfully."
#                 ),
#                 "admission_number": admission.application_number,
#                 "student_id": student_id_value,
#                 "student_name": (
#                     f"{student.first_name} {student.last_name}"
#                 ),
#                 "username": username,
#                 "temporary_password": temporary_password,
#                 "role": user.role,
#                 "academic_year": data["academic_year"].name,
#                 "class": data["school_class"].name,
#                 "section": data["section"].name,
#             },
#             status=status.HTTP_201_CREATED,
#         )


class ApproveAdmissionView(generics.GenericAPIView):

    queryset = AdmissionApplication.objects.all()
    serializer_class = ApproveAdmissionSerializer
    permission_classes = [IsAdmissionAdmin]

    def post(self, request, pk):

        # Check permission on the requested application.
        self.get_object()

        try:

            with transaction.atomic():

                # Global lock: serialize approval operations.
                RollNumberGenerationLock.objects.select_for_update().get(
                    pk=1
                )

                # Lock this admission against duplicate approval.
                admission = (
                    AdmissionApplication.objects
                    .select_for_update()
                    .get(pk=pk)
                )

                # Prevent duplicate student creation.
                if Student.objects.filter(
                    admission=admission
                ).exists():

                    return Response(
                        {
                            "detail": (
                                "This admission application has already "
                                "been converted to a student."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Validate approval data.
                serializer = self.get_serializer(
                    data=request.data
                )

                serializer.is_valid(raise_exception=True)

                data = serializer.validated_data

                # Generate username.
                username = f"student{admission.id:05d}"

                if User.objects.filter(
                    username=username
                ).exists():

                    return Response(
                        {
                            "detail": (
                                f"Username '{username}' already exists."
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Generate secure temporary password.
                temporary_password = secrets.token_urlsafe(12)

                # Generate permanent class-wise roll number.
                roll_number, class_key = (
                    generate_class_roll_number(
                        data["school_class"]
                    )
                )

                # Create student user.
                user = User.objects.create_user(
                    username=username,
                    password=temporary_password,
                    first_name=admission.student_first_name,
                    last_name=admission.student_last_name,
                    email=admission.parent_email,
                    phone=admission.parent_phone,
                    role=User.Role.STUDENT,
                    is_active=True,
                )

                # Update admission status.
                admission.status = (
                    AdmissionApplication.Status.APPROVED
                )

                admission.save(
                    update_fields=["status", "updated_at"]
                )

                # Create student profile.
                student = Student.objects.create(
                    user=user,
                    admission=admission,

                    first_name=admission.student_first_name,
                    middle_name=admission.student_middle_name,
                    last_name=admission.student_last_name,

                    date_of_birth=admission.date_of_birth,
                    gender=admission.gender,

                    academic_year=data["academic_year"],
                    school_class=data["school_class"],
                    section=data["section"],

                    roll_number=roll_number,
                    roll_number_class_key=class_key,

                    father_name=admission.father_name,
                    mother_name=admission.mother_name,

                    parent_phone=admission.parent_phone,
                    parent_email=admission.parent_email,

                    address=admission.address,
                    city=admission.city,
                    state=admission.state,
                    postal_code=admission.postal_code,

                    is_active=True,
                )

                # Send credentials to parent email.
                # Email failure rolls back this transaction.
                send_student_credentials_email(
                    student=student,
                    username=username,
                    temporary_password=temporary_password,
                )

                return Response(
                    {
                        "success": True,
                        "message": (
                            "Admission approved, student created, "
                            "and credentials email submitted successfully."
                        ),

                        "admission_number": (
                            admission.application_number
                        ),

                        "student_id": student.student_id,
                        "roll_number": student.roll_number,

                        "student_name": (
                            f"{student.first_name} "
                            f"{student.last_name}"
                        ),

                        "username": username,

                        "email_sent_to": admission.parent_email,

                        "role": user.role,

                        "academic_year": data["academic_year"].name,
                        "class": data["school_class"].name,
                        "section": data["section"].name,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except StudentCredentialEmailError:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Student approval was not completed because "
                        "the credentials email could not be submitted. "
                        "Please check Gmail SMTP configuration and retry."
                    ),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )



# --------------------------------------------------
# 6. STUDENT / ADMIN DOCUMENT ACCESS PERMISSION
# --------------------------------------------------

class IsAdmissionOwnerOrAdmin(BasePermission):

    def has_object_permission(self, request, view, admission):

        # Admin access
        admin_permission = IsAdmissionAdmin()

        if admin_permission.has_permission(request, view):
            return True

        # Student can access only their own admission
        return Student.objects.filter(
            user=request.user,
            admission=admission,
        ).exists()


# --------------------------------------------------
# 7. GENERATE SECURE SUPABASE SIGNED URL
# --------------------------------------------------

class AdmissionDocumentSignedURLView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmissionOwnerOrAdmin,
    ]

    def get(self, request, pk):

        admission = get_object_or_404(
            AdmissionApplication,
            pk=pk,
        )

        self.check_object_permissions(request, admission)

        photo_path = (
            admission.student_photo.name
            if admission.student_photo
            else None
        )

        marksheet_path = (
            admission.previous_marksheet.name
            if admission.previous_marksheet
            else None
        )

        photo_url = (
            create_document_signed_url(photo_path)
            if photo_path
            else None
        )

        marksheet_url = (
            create_document_signed_url(marksheet_path)
            if marksheet_path
            else None
        )

        return Response(
            {
                "admission_id": admission.id,
                "student_photo_url": photo_url,
                "previous_marksheet_url": marksheet_url,
                "expires_in": 300,
            },
            status=status.HTTP_200_OK,
        )
