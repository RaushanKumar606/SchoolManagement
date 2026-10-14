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


class AdmissionApplicationCreateView(generics.CreateAPIView):
    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionApplicationSerializer
    permission_classes = [AllowAny]


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


class ApproveAdmissionView(generics.GenericAPIView):
    queryset = AdmissionApplication.objects.all()
    serializer_class = ApproveAdmissionSerializer
    permission_classes = [IsAdmissionAdmin]

    @transaction.atomic
    def post(self, request, pk):
        admission = self.get_object()

        # 1. Prevent duplicate student creation
        if hasattr(admission, "student"):
            return Response(
                {
                    "detail": "This admission application has already been converted to a student."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Update admission status directly
        admission.status = AdmissionApplication.Status.APPROVED
        admission.save()

        # 3. Validate request data
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("--- SERIALIZER ERRORS ---", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # 4. Generate unique username
        username = f"student{admission.id:05d}"
        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": f"Student username '{username}' already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 5. Temporary password
        temporary_password = f"Student@{admission.id}123"

        # 6. Create User record
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

        # 7. Create Student record
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

        student_id_value = getattr(student, "student_id", student.id)

        # 8. Return success response
        return Response(
            {
                "message": "Admission approved and student login created successfully.",
                "admission_number": admission.application_number,
                "student_id": student_id_value,
                "student_name": f"{student.first_name} {student.last_name}",
                "username": username,
                "temporary_password": temporary_password,
                "role": user.role,
                "academic_year": data["academic_year"].name,
                "class": data["school_class"].name,
                "section": data["section"].name,
            },
            status=status.HTTP_201_CREATED,
        )