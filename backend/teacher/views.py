import logging
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .models import TeacherRegistration
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.permissions import IsAdminUser, AllowAny
import random
import string
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone
from django.db.models import Count, Q

from datetime import date

from django.db import transaction


from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Teacher, TeacherRegistration
from common.supabase_storage import create_document_signed_url

logger = logging.getLogger(__name__)

from rest_framework.decorators import (
    api_view,
    permission_classes
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import AdminTeacherSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes,
)


from common.supabase_storage import create_document_signed_url
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from common.supabase_storage import (
    upload_document,
    delete_document,
)
from django.contrib.auth import get_user_model

User = get_user_model()
logger = logging.getLogger(__name__)


import json
from .models import (
    Teacher, TeacherRegistration, TeacherSubjectAllocation,
    Attendance,  Assignment,AssignmentSubmission
)


from academics.models import (
    SchoolClass,
    Section,
    Timetable,
    Subject,
)

from applications.utils import is_teacher_hiring_open
from rest_framework import status
from students.models import Student
from rest_framework import generics
from .models import TeacherSubjectAllocation
from .serializers import TeacherSubjectAllocationSerializer


from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import AssignmentSerializer


class TeacherSubjectAllocationListCreateView(
    generics.ListCreateAPIView
):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherSubjectAllocationSerializer

    def get_queryset(self):
        queryset = (
            TeacherSubjectAllocation.objects
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject",
            )
            .order_by(
                "school_class__display_order",
                "teacher__name",
            )
        )

        user = self.request.user

        # =====================================
        # ROLE BASED FILTERING
        # =====================================

        user_role = str(
            getattr(user, "role", "")
        ).upper()

        if user_role == "TEACHER":
            teacher = Teacher.objects.filter(
                user=user
            ).first()

            if not teacher:
                return queryset.none()

            queryset = queryset.filter(
                teacher=teacher
            )

        elif user_role not in [
            "SCHOOL_ADMIN",
            "SUPER_ADMIN",
        ]:
            return queryset.none()

        # =====================================
        # OPTIONAL FILTERS
        # =====================================

        teacher_id = self.request.query_params.get(
            "teacher"
        )

        school_class_id = self.request.query_params.get(
            "school_class"
        )

        section_id = self.request.query_params.get(
            "section"
        )

        subject_id = self.request.query_params.get(
            "subject"
        )

        if teacher_id and user_role in [
            "SCHOOL_ADMIN",
            "SUPER_ADMIN",
        ]:
            queryset = queryset.filter(
                teacher_id=teacher_id
            )

        if school_class_id:
            queryset = queryset.filter(
                school_class_id=school_class_id
            )

        if section_id:
            queryset = queryset.filter(
                section_id=section_id
            )

        if subject_id:
            queryset = queryset.filter(
                subject_id=subject_id
            )

        return queryset

    

@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def teacher_register_api(request):
    uploaded_paths = []
    user = None

    try:
        # 1. Check teacher hiring setting
        if not is_teacher_hiring_open():
            return Response(
                {
                    "success": False,
                    "error": "Teacher hiring applications are currently closed."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data
        files = request.FILES

        # 2. Validate required text fields
        required_fields = [
            "name",
            "email",
            "password",
            "phone",
            "department",
            "primary_subject",
            "qualification",
        ]

        for field in required_fields:
            if not data.get(field):
                return Response(
                    {
                        "success": False,
                        "error": f"{field.replace('_', ' ').title()} is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        name = data.get("name").strip()
        email = data.get("email").strip().lower()
        password = data.get("password")

        # 3. Check duplicate email
        if TeacherRegistration.objects.filter(email__iexact=email).exists():
            return Response(
                {
                    "success": False,
                    "error": "Email is already registered!"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username__iexact=email).exists():
            return Response(
                {
                    "success": False,
                    "error": "User with this email already exists!"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Document configuration
        document_config = {
            "profile_photo": {
                "types": ["image/jpeg", "image/png"],
                "extensions": [".jpg", ".jpeg", ".png"],
                "folder": "teacher-applications/profile",
                "required": True,
            },
            "resume": {
                "types": ["application/pdf"],
                "extensions": [".pdf"],
                "folder": "teacher-applications/resume",
                "required": True,
            },
            "qualification_certificate": {
                "types": ["application/pdf"],
                "extensions": [".pdf"],
                "folder": "teacher-applications/qualification",
                "required": True,
            },
            "experience_certificate": {
                "types": ["application/pdf"],
                "extensions": [".pdf"],
                "folder": "teacher-applications/experience",
                "required": False,
            },
        }

        max_size = 5 * 1024 * 1024  # 5 MB

        # 5. Validate all files before uploading
        for field, config in document_config.items():
            uploaded_file = files.get(field)

            if not uploaded_file:
                if config["required"]:
                    return Response(
                        {
                            "success": False,
                            "error": f"{field.replace('_', ' ').title()} is required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                continue

            extension = "." + uploaded_file.name.rsplit(".", 1)[-1].lower() \
                if "." in uploaded_file.name else ""

            if uploaded_file.content_type not in config["types"]:
                return Response(
                    {
                        "success": False,
                        "error": f"Invalid file type for {field}."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if extension not in config["extensions"]:
                return Response(
                    {
                        "success": False,
                        "error": f"Invalid file extension for {field}."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if uploaded_file.size > max_size:
                return Response(
                    {
                        "success": False,
                        "error": f"{field} must not exceed 5 MB."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 6. Upload documents to Supabase
        document_paths = {
            "profile_photo_path": None,
            "resume_path": None,
            "qualification_certificate_path": None,
            "experience_certificate_path": None,
        }

        for field, config in document_config.items():
            uploaded_file = files.get(field)

            if uploaded_file:
                path = upload_document(
                    uploaded_file,
                    config["folder"]
                )

                uploaded_paths.append(path)

                document_paths[f"{field}_path"] = path

        # 7. Create user and registration
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name,
                role="teacher",
                is_active=False,
            )

            TeacherRegistration.objects.create(
                user=user,
                name=name,
                email=email,
                phone=data.get("phone"),
                department=data.get("department"),
                primary_subject=data.get("primary_subject"),
                qualification=data.get("qualification"),
                status="Pending",
                **document_paths
            )

        return Response(
            {
                "success": True,
                "message": (
                    "Teacher registration submitted successfully! "
                    "Please wait for Admin approval."
                )
            },
            status=status.HTTP_201_CREATED
        )

    except ValueError as error:
        for path in uploaded_paths:
            try:
                delete_document(path)
            except Exception:
                logger.exception("Supabase cleanup failed: %s", path)

        return Response(
            {
                "success": False,
                "error": str(error)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception:
        for path in uploaded_paths:
            try:
                delete_document(path)
            except Exception:
                logger.exception("Supabase cleanup failed: %s", path)

        if user:
            try:
                user.delete()
            except Exception:
                logger.exception("User cleanup failed.")

        logger.exception("Teacher registration failed.")

        return Response(
            {
                "success": False,
                "error": "Unable to submit teacher registration. Please try again."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# B. Admin: Pending Teachers ki list dekhne ke liye
@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_teachers_list(request):
    teachers = TeacherRegistration.objects.filter(status='Pending').values(
        'id', 'name', 'email', 'phone', 'department', 'primary_subject', 'qualification', 'created_at'
    )
    return Response({"success": True, "teachers": list(teachers)})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def pending_teacher_detail(request, teacher_id):

    try:
        registration = TeacherRegistration.objects.get(
            id=teacher_id,
            status="Pending"
        )

        data = {
            "id": registration.id,
            "name": registration.name,
            "email": registration.email,
            "phone": registration.phone,
            "department": registration.department,
            "primary_subject": registration.primary_subject,
            "qualification": registration.qualification,
            "status": registration.status,
            "created_at": registration.created_at,

            # Supabase signed document URLs
            "profile_photo": create_document_signed_url(
                registration.profile_photo_path
            ),

            "resume": create_document_signed_url(
                registration.resume_path
            ),

            "qualification_certificate": create_document_signed_url(
                registration.qualification_certificate_path
            ),

            "experience_certificate": create_document_signed_url(
                registration.experience_certificate_path
            ),
        }

        return Response({
            "success": True,
            "teacher": data
        })

    except TeacherRegistration.DoesNotExist:
        return Response({
            "success": False,
            "error": "Pending teacher application not found."
        }, status=404)

    except Exception:
        logger.exception("Unable to fetch pending teacher details")

        return Response({
            "success": False,
            "error": "Unable to load teacher application details."
        }, status=500)
 

# C. Admin: Teacher ko Approve karne ke liye

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_teacher_api(request, teacher_id):

    try:
        registration = TeacherRegistration.objects.get(id=teacher_id)

        if registration.status == "Approved":
            return Response({
                "success": False,
                "message": "Teacher is already approved!"
            }, status=400)

        user = registration.user

        # ==============================
        # 1. Generate Unique Employee ID
        # ==============================
        while True:
            emp_id = f"TCH-{random.randint(1000, 9999)}"

            if not User.objects.filter(username=emp_id).exists():
                if not Teacher.objects.filter(employee_id=emp_id).exists():
                    break

        # ==============================
        # 2. Generate Temporary Password
        # ==============================
        raw_password = ''.join(
            random.choices(
                string.ascii_letters + string.digits,
                k=8
            )
        )

        # ==============================
        # 3. Activate User
        # ==============================
        user.username = emp_id
        user.is_active = True
        user.set_password(raw_password)
        user.save()

        # ==============================
        # 4. Update Registration
        # ==============================
        registration.employee_id = emp_id
        registration.status = "Approved"
        registration.save()

        # ==============================
        # 5. Create / Update Teacher
        # ==============================
        teacher, created = Teacher.objects.get_or_create(
            user=user,
            defaults={
                "name": registration.name,
                "email": registration.email,
                "employee_id": emp_id,
                "phone": registration.phone,
                "qualification": registration.qualification,
                "department": registration.department,
                "primary_subject": registration.primary_subject,
                "admin": request.user,
                "must_change_password": True,
            }
        )

        if not created:
            teacher.employee_id = emp_id
            teacher.name = registration.name
            teacher.email = registration.email
            teacher.phone = registration.phone
            teacher.qualification = registration.qualification
            teacher.department = registration.department
            teacher.primary_subject = registration.primary_subject
            teacher.admin = request.user

        # First login par password change compulsory
        teacher.must_change_password = True
        teacher.save()

        # ==============================
        # 6. Send Email
        # ==============================
        subject = "Your Teacher Account has been Approved!"

        message = f"""
Hello {registration.name},

Your teacher application has been approved.

Employee ID: {emp_id}
Username: {emp_id}
Temporary Password: {raw_password}

Please login using these credentials.

For security, you must change your password during your first login.

Regards,
School Administration
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [registration.email],
            fail_silently=False
        )

        # ==============================
        # 7. Response
        # ==============================
        return Response({
            "success": True,
            "message": f"Teacher {registration.name} approved successfully!",
            "employee_id": emp_id,
            "username": emp_id,
            "temporary_password": raw_password,
            "must_change_password": True
        }, status=200)

    except TeacherRegistration.DoesNotExist:
        return Response({
            "success": False,
            "message": "Teacher application not found."
        }, status=404)

    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=400)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def reject_teacher_api(request, teacher_id):
    try:
        registration = TeacherRegistration.objects.get(
            id=teacher_id
        )

        if registration.status != "Pending":
            return Response({
                "success": False,
                "error": "Only pending applications can be rejected."
            }, status=400)

        reason = request.data.get("rejection_reason", "").strip()

        if not reason:
            return Response({
                "success": False,
                "error": "Please provide a rejection reason."
            }, status=400)

        registration.status = "Rejected"
        registration.rejection_reason = reason
        registration.save(
            update_fields=["status", "rejection_reason"]
        )

        return Response({
            "success": True,
            "message": "Teacher application rejected successfully.",
            "teacher_id": registration.id,
            "status": registration.status,
            "rejection_reason": registration.rejection_reason
        }, status=200)

    except TeacherRegistration.DoesNotExist:
        return Response({
            "success": False,
            "error": "Teacher application not found."
        }, status=404)

    except Exception:
        logger.exception("Reject teacher API failed")

        return Response({
            "success": False,
            "error": "Unable to reject teacher application."
        }, status=500)

# pending_teachers_list
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_teachers_list(request):
    try:
        teachers = (
            Teacher.objects
            .select_related("user")
            .filter(user__is_active=True)
            .order_by("-id")
        )

        data = []

        for teacher in teachers:
            registration = TeacherRegistration.objects.filter(
                user_id=teacher.user_id
            ).first() if teacher.user_id else None

            data.append({
                "id": teacher.id,
                "name": teacher.name,
                "employee_id": teacher.employee_id,
                "email": teacher.user.email if teacher.user else "",
                "phone": teacher.phone or "",
                "department": teacher.department or "",
                "primary_subject": teacher.primary_subject or "",
                "qualification": teacher.qualification or "",
                "is_active": teacher.user.is_active if teacher.user else False,
                "status": registration.status if registration else "Approved",
                "profile_photo": bool(
                    registration and registration.profile_photo_path
                ),
            })

        return Response({
            "success": True,
            "count": len(data),
            "teachers": data,
        })

    except Exception:
        logger.exception("Admin teachers list API failed")

        return Response({
            "success": False,
            "error": "Unable to load teachers.",
        }, status=500)

# ADMIN TEACHER DETAIL VIEW
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_teacher_detail(request, employee_id):
    try:
        teacher = (
            Teacher.objects
            .select_related("user")
            .get(employee_id=employee_id)
        )

        registration = None

        if teacher.user_id:
            registration = TeacherRegistration.objects.filter(
                user_id=teacher.user_id
            ).first()

        def get_signed_url(path):
            if not path:
                return None

            try:
                return create_document_signed_url(path)
            except Exception:
                logger.exception("Document signed URL generation failed")
                return None

        # Teacher allocations
        allocations = (
            teacher.assigned_classes
            .select_related("school_class", "section", "subject")
            .order_by(
                "school_class__display_order",
                "section__name",
                "subject__name",
            )
        )

        classes = []

        for item in allocations:
            classes.append({
                "allocationId": item.id,
                "classId": item.school_class_id,
                "className": item.school_class.name,
                "sectionId": item.section_id,
                "section": item.section.name,
                "subjectId": item.subject_id,
                "subject": item.subject.name,
                "subjectCode": item.subject.code,
            })

        teacher_data = {
            "id": teacher.id,
            "name": teacher.name,
            "employee_id": teacher.employee_id,
            "email": teacher.user.email if teacher.user else "",
            "phone": teacher.phone or "",
            "department": teacher.department or "",
            "primary_subject": teacher.primary_subject or "",
            "qualification": teacher.qualification or "",
            "is_active": teacher.user.is_active if teacher.user else False,
            "status": registration.status if registration else "Approved",

            "profile_photo": get_signed_url(
                registration.profile_photo_path
            ) if registration else None,

            "documents": {
                "resume": get_signed_url(
                    registration.resume_path
                ) if registration else None,

                "qualification_certificate": get_signed_url(
                    registration.qualification_certificate_path
                ) if registration else None,

                "experience_certificate": get_signed_url(
                    registration.experience_certificate_path
                ) if registration else None,
            },

            "classes": classes,
        }

        return Response({
            "success": True,
            "teacher": teacher_data,
        })

    except Teacher.DoesNotExist:
        return Response({
            "success": False,
            "error": "Teacher not found.",
        }, status=404)

    except Exception:
        logger.exception("Admin teacher detail API failed")

        return Response({
            "success": False,
            "error": "Unable to load teacher details.",
        }, status=500)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_teacher_update(request, employee_id):
    try:
        with transaction.atomic():
            teacher = (
                Teacher.objects
                .select_related("user")
                .get(employee_id=employee_id)
            )

            registration = None

            if teacher.user_id:
                registration = TeacherRegistration.objects.filter(
                    user_id=teacher.user_id
                ).first()

            allowed_fields = [
                "name",
                "department",
                "primary_subject",
                "phone",
                "qualification",
            ]

            for field in allowed_fields:
                if field in request.data:
                    value = str(request.data[field]).strip()

                    setattr(teacher, field, value)

                    if registration:
                        setattr(registration, field, value)

            if "email" in request.data:
                email = str(request.data["email"]).strip().lower()

                if not email:
                    return Response({
                        "success": False,
                        "error": "Email is required.",
                    }, status=400)

                if teacher.user:
                    teacher.user.email = email
                    teacher.user.save(update_fields=["email"])

                if registration:
                    registration.email = email

            teacher.save()

            if registration:
                registration.save()

            return Response({
                "success": True,
                "message": "Teacher updated successfully.",
                "teacher": {
                    "id": teacher.id,
                    "name": teacher.name,
                    "employee_id": teacher.employee_id,
                    "email": teacher.user.email if teacher.user else "",
                    "phone": teacher.phone or "",
                    "department": teacher.department or "",
                    "primary_subject": teacher.primary_subject or "",
                    "qualification": teacher.qualification or "",
                    "is_active": teacher.user.is_active if teacher.user else False,
                },
            })

    except Teacher.DoesNotExist:
        return Response({
            "success": False,
            "error": "Teacher not found.",
        }, status=404)

    except Exception:
        logger.exception("Admin teacher update API failed")

        return Response({
            "success": False,
            "error": "Unable to update teacher.",
        }, status=500)

    
@api_view(['POST'])
@permission_classes([AllowAny])
def teacher_login_api(request):
    try:
        employee_id = request.data.get('employee_id')
        password = request.data.get('password')

        if not employee_id or not password:
            return Response({
                "success": False,
                "error": "Employee ID and password are required"
            }, status=400)

        user = authenticate(
            username=employee_id,
            password=password
        )

        if user is None:
            return Response({
                "success": False,
                "error": "Invalid Employee ID or Password"
            }, status=400)

        # Teacher role check
        if user.role != "teacher":
            return Response({
                "success": False,
                "error": f"Invalid user role: {user.role}"
            }, status=403)

        # Teacher profile
        teacher = Teacher.objects.get(user=user)

        # ==========================================
        # CREATE JWT
        # ==========================================

        refresh = RefreshToken.for_user(user)

        refresh["username"] = user.username
        refresh["role"] = "teacher"

        access_token = refresh.access_token
        access_token["username"] = user.username
        access_token["role"] = "teacher"

        return Response({
            "success": True,
            "message": "Login Successful!",

            # JWT
            "access": str(access_token),
            "refresh": str(refresh),

            # User
            "user_id": user.id,
            "username": user.username,
            "role": "teacher",

            # Teacher
            "employee_id": teacher.employee_id,
            "name": teacher.name,
            "department": teacher.department,
            "subject": teacher.primary_subject,

            # First login
            "must_change_password": teacher.must_change_password

        }, status=200)

    except Teacher.DoesNotExist:
        return Response({
            "success": False,
            "error": "Teacher profile not found."
        }, status=404)

    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=500)
    


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_detail_api(request, employee_id):
    try:
        teacher = (
            Teacher.objects
            .select_related("user")
            .get(employee_id=employee_id)
        )

        # Security: A teacher can only access their own profile.
        # Admin access can be handled separately if required.
        if (
            teacher.user_id != request.user.id
            and not request.user.is_staff
        ):
            return Response(
                {
                    "success": False,
                    "error": "You are not allowed to access this teacher profile."
                },
                status=403
            )

        # Find corresponding registration
        registration = None

        if teacher.user_id:
            registration = (
                TeacherRegistration.objects
                .filter(user_id=teacher.user_id)
                .first()
            )

        if not registration:
            registration = (
                TeacherRegistration.objects
                .filter(employee_id=teacher.employee_id)
                .first()
            )

        # Generate temporary signed URLs
        profile_photo_url = None
        resume_url = None
        qualification_certificate_url = None
        experience_certificate_url = None

        if registration:
            if registration.profile_photo_path:
                profile_photo_url = create_document_signed_url(
                    registration.profile_photo_path
                )

            if registration.resume_path:
                resume_url = create_document_signed_url(
                    registration.resume_path
                )

            if registration.qualification_certificate_path:
                qualification_certificate_url = create_document_signed_url(
                    registration.qualification_certificate_path
                )

            if registration.experience_certificate_path:
                experience_certificate_url = create_document_signed_url(
                    registration.experience_certificate_path
                )

        # Teacher allocations
        allocations = (
            teacher.assigned_classes
            .select_related(
                "school_class",
                "section",
                "subject"
            )
            .order_by(
                "school_class__display_order",
                "section__name",
                "subject__name",
            )
        )

        classes_list = []

        for item in allocations:
            classes_list.append({
                "allocationId": item.id,

                "classId": item.school_class.id,
                "className": item.school_class.name,

                "sectionId": item.section.id,
                "section": item.section.name,

                "subjectId": item.subject.id,
                "subject": item.subject.name,
                "subjectCode": item.subject.code,
            })

        return Response({
            "success": True,
            "data": {
                "id": teacher.id,
                "name": teacher.name,
                "employeeId": teacher.employee_id,

                "email": (
                    teacher.user.email
                    if teacher.user
                    else teacher.email or ""
                ),

                "phone": teacher.phone or "",
                "department": teacher.department or "",
                "subject": teacher.primary_subject or "",
                "qualification": teacher.qualification or "",

                "mustChangePassword": teacher.must_change_password,

                # Profile photo
                "profilePhoto": profile_photo_url,

                # Teacher documents
                "documents": {
                    "resume": resume_url,
                    "qualificationCertificate": qualification_certificate_url,
                    "experienceCertificate": experience_certificate_url,
                },

                "classes": classes_list,
            }
        })

    except Teacher.DoesNotExist:
        return Response(
            {
                "success": False,
                "error": "Teacher not found."
            },
            status=404
        )

    except Exception:
        logger.exception("Teacher detail API failed")

        return Response(
            {
                "success": False,
                "error": "Unable to load teacher profile."
            },
            status=500
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_class_students_api(request, employee_id, class_name, section):
    try:
        teacher = Teacher.objects.get(
            employee_id=employee_id
        )

        # Find the actual SchoolClass
        school_class = SchoolClass.objects.filter(
            name=class_name
        ).first()

        if not school_class:
            return Response(
                {
                    "success": False,
                    "error": "Class not found."
                },
                status=404
            )

        # Find the actual Section belonging to this class
        section_obj = Section.objects.filter(
            school_class=school_class,
            name=section
        ).first()

        if not section_obj:
            return Response(
                {
                    "success": False,
                    "error": "Section not found for this class."
                },
                status=404
            )

        # Teacher must be assigned to this class + section
        allocation_exists = TeacherSubjectAllocation.objects.filter(
            teacher=teacher,
            school_class=school_class,
            section=section_obj
        ).exists()

        if not allocation_exists:
            return Response(
                {
                    "success": False,
                    "error": (
                        "You are not assigned to this class and section."
                    )
                },
                status=403
            )

        # Get actual students
        students = (
            Student.objects
            .filter(
                school_class=school_class,
                section=section_obj,
                is_active=True
            )
            .order_by(
                "student_id"
            )
        )

        student_list = []

        for student in students:
            student_list.append({
                "id": student.id,
                "studentId": student.student_id,
                "name": (
                    f"{student.first_name} "
                    f"{student.middle_name + ' ' if student.middle_name else ''}"
                    f"{student.last_name}"
                ).strip(),
                "firstName": student.first_name,
                "middleName": student.middle_name,
                "lastName": student.last_name,
                "gender": student.gender,
                "className": student.school_class.name,
                "section": student.section.name,
                "parentName": student.father_name,
                "parentPhone": student.parent_phone,
            })

        return Response({
            "success": True,
            "teacher": {
                "employeeId": teacher.employee_id,
                "name": teacher.name,
            },
            "class": {
                "id": school_class.id,
                "name": school_class.name,
            },
            "section": {
                "id": section_obj.id,
                "name": section_obj.name,
            },
            "students": student_list,
            "count": len(student_list),
        })

    except Teacher.DoesNotExist:
        return Response(
            {
                "success": False,
                "error": "Teacher not found."
            },
            status=404
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_my_courses_api(request):
    try:
        # Logged-in teacher only
        if getattr(request.user, "role", "").lower() != "teacher":
            return Response(
                {
                    "success": False,
                    "error": "Teacher access required."
                },
                status=403
            )

        teacher = Teacher.objects.get(user=request.user)

        allocations = (
            TeacherSubjectAllocation.objects
            .filter(teacher=teacher)
            .select_related(
                "school_class",
                "section",
                "subject",
                "school_class__academic_year",
            )
            .order_by(
                "school_class__name",
                "section__name",
                "subject__name",
            )
        )

        courses = []

        for allocation in allocations:
            academic_year = getattr(
                allocation.school_class,
                "academic_year",
                None,
            )

            courses.append({
                "id": allocation.id,
                "class_id": allocation.school_class_id,
                "class_name": allocation.school_class.name,
                "section_id": allocation.section_id,
                "section_name": allocation.section.name,
                "subject_id": allocation.subject_id,
                "subject_name": allocation.subject.name,
                "academic_year": (
                    academic_year.name if academic_year else None
                ),
            })

        return Response({
            "success": True,
            "count": len(courses),
            "courses": courses,
        })

    except Teacher.DoesNotExist:
        return Response(
            {
                "success": False,
                "error": "Teacher profile not found."
            },
            status=404
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_subject_students_api(
    request,
    employee_id,
    class_name,
    section,
    subject_id
):
    try:
        teacher = Teacher.objects.get(
            employee_id=employee_id
        )

        school_class = SchoolClass.objects.filter(
            name=class_name
        ).first()

        if not school_class:
            return Response(
                {
                    "success": False,
                    "error": "Class not found."
                },
                status=404
            )

        section_obj = Section.objects.filter(
            school_class=school_class,
            name=section
        ).first()

        if not section_obj:
            return Response(
                {
                    "success": False,
                    "error": "Section not found for this class."
                },
                status=404
            )

        # Check exact Teacher + Class + Section + Subject allocation
        allocation = (
            TeacherSubjectAllocation.objects
            .select_related(
                "school_class",
                "section",
                "subject",
                "teacher",
            )
            .filter(
                teacher=teacher,
                school_class=school_class,
                section=section_obj,
                subject_id=subject_id,
            )
            .first()
        )

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "You are not assigned to this "
                        "class, section and subject."
                    )
                },
                status=403
            )

        students = (
            MainStudent.objects
            .filter(
                school_class=school_class,
                section=section_obj,
                is_active=True,
            )
            .order_by("student_id")
        )

        student_list = []

        for student in students:
            student_list.append({
                "id": student.id,
                "studentId": student.student_id,
                "name": (
                    f"{student.first_name} "
                    f"{student.middle_name + ' ' if student.middle_name else ''}"
                    f"{student.last_name}"
                ).strip(),
                "firstName": student.first_name,
                "middleName": student.middle_name,
                "lastName": student.last_name,
                "gender": student.gender,
                "className": student.school_class.name,
                "section": student.section.name,
                "parentName": student.father_name,
                "parentPhone": student.parent_phone,
            })

        return Response({
            "success": True,

            "teacher": {
                "employeeId": teacher.employee_id,
                "name": teacher.name,
            },

            "class": {
                "id": school_class.id,
                "name": school_class.name,
            },

            "section": {
                "id": section_obj.id,
                "name": section_obj.name,
            },

            "subject": {
                "id": allocation.subject.id,
                "name": allocation.subject.name,
                "code": allocation.subject.code,
            },

            "students": student_list,
            "count": len(student_list),
        })

    except Teacher.DoesNotExist:
        return Response(
            {
                "success": False,
                "error": "Teacher not found."
            },
            status=404
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enter_exam_marks_api(request):
    try:
        employee_id = request.data.get("employee_id")
        student_id = request.data.get("student_id")
        subject_id = request.data.get("subject_id")
        exam_name = request.data.get("exam_name")
        marks_obtained = request.data.get("marks_obtained")
        total_marks = request.data.get("total_marks", 100)

        # --------------------------------
        # Required fields
        # --------------------------------

        if not employee_id:
            return Response(
                {"success": False, "error": "Employee ID is required."},
                status=400
            )

        if not student_id:
            return Response(
                {"success": False, "error": "Student ID is required."},
                status=400
            )

        if not subject_id:
            return Response(
                {"success": False, "error": "Subject ID is required."},
                status=400
            )

        if not exam_name:
            return Response(
                {"success": False, "error": "Exam name is required."},
                status=400
            )

        if marks_obtained is None:
            return Response(
                {"success": False, "error": "Marks obtained is required."},
                status=400
            )

        # --------------------------------
        # Get Teacher
        # --------------------------------

        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {"success": False, "error": "Teacher not found."},
                status=404
            )

        # --------------------------------
        # Get Actual Student
        # --------------------------------

        student = Student.objects.select_related(
            "academic_year",
            "school_class",
            "section"
        ).filter(
            id=student_id,
            is_active=True
        ).first()

        if not student:
            return Response(
                {"success": False, "error": "Student not found."},
                status=404
            )

        # --------------------------------
        # Get Subject
        # --------------------------------

        subject_obj = Subject.objects.filter(
            id=subject_id,
            is_active=True
        ).first()

        if not subject_obj:
            return Response(
                {"success": False, "error": "Subject not found."},
                status=404
            )

        # --------------------------------
        # Verify Teacher Allocation
        #
        # Teacher must be assigned to:
        # Student's Class
        # Student's Section
        # Same Subject
        # --------------------------------

        allocation = TeacherSubjectAllocation.objects.select_related(
            "school_class",
            "section",
            "subject"
        ).filter(
            teacher=teacher,
            school_class=student.school_class,
            section=student.section,
            subject=subject_obj
        ).first()

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "Access denied. You are not assigned "
                        "to this student's class, section and subject."
                    )
                },
                status=403
            )

        # --------------------------------
        # Validate Marks
        # --------------------------------

        try:
            marks_obtained = float(marks_obtained)
            total_marks = float(total_marks)
        except (ValueError, TypeError):
            return Response(
                {
                    "success": False,
                    "error": "Marks must be numeric."
                },
                status=400
            )

        if total_marks <= 0:
            return Response(
                {
                    "success": False,
                    "error": "Total marks must be greater than 0."
                },
                status=400
            )

        if marks_obtained < 0:
            return Response(
                {
                    "success": False,
                    "error": "Marks cannot be negative."
                },
                status=400
            )

        if marks_obtained > total_marks:
            return Response(
                {
                    "success": False,
                    "error": "Obtained marks cannot exceed total marks."
                },
                status=400
            )

        # --------------------------------
        # Create / Update Exam Mark
        # --------------------------------

        exam_mark, created = ExamMark.objects.update_or_create(
            student=student,
            subject=subject_obj,
            exam_name=exam_name,
            defaults={
                "marks_obtained": marks_obtained,
                "total_marks": total_marks,
                "teacher": teacher
            }
        )

        # --------------------------------
        # Response
        # --------------------------------

        return Response(
            {
                "success": True,
                "message": (
                    "Exam marks added successfully."
                    if created
                    else "Exam marks updated successfully."
                ),
                "data": {
                    "id": exam_mark.id,

                    "student": {
                        "id": student.id,
                        "studentId": student.student_id,
                        "name": (
                            f"{student.first_name} "
                            f"{student.middle_name + ' ' if student.middle_name else ''}"
                            f"{student.last_name}"
                        ).strip(),
                        "classId": student.school_class.id,
                        "className": student.school_class.name,
                        "sectionId": student.section.id,
                        "section": student.section.name
                    },

                    "subject": {
                        "id": subject_obj.id,
                        "name": subject_obj.name,
                        "code": subject_obj.code
                    },

                    "examName": exam_mark.exam_name,
                    "marksObtained": exam_mark.marks_obtained,
                    "totalMarks": exam_mark.total_marks,

                    "teacher": {
                        "id": teacher.id,
                        "employeeId": teacher.employee_id,
                        "name": teacher.name
                    }
                }
            },
            status=201 if created else 200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_bulk_exam_marks_api(request):
    try:
        employee_id = request.data.get("employee_id")
        class_id = request.data.get("class_id")
        section_id = request.data.get("section_id")
        subject_id = request.data.get("subject_id")
        exam_name = request.data.get("exam_name")
        total_marks = request.data.get("total_marks", 100)
        marks_list = request.data.get("marks")

        # --------------------------------
        # Required fields
        # --------------------------------

        if not employee_id:
            return Response(
                {"success": False, "error": "Employee ID is required."},
                status=400
            )

        if not class_id:
            return Response(
                {"success": False, "error": "Class ID is required."},
                status=400
            )

        if not section_id:
            return Response(
                {"success": False, "error": "Section ID is required."},
                status=400
            )

        if not subject_id:
            return Response(
                {"success": False, "error": "Subject ID is required."},
                status=400
            )

        if not exam_name:
            return Response(
                {"success": False, "error": "Exam name is required."},
                status=400
            )

        if not isinstance(marks_list, list):
            return Response(
                {"success": False, "error": "Marks must be a list."},
                status=400
            )

        # --------------------------------
        # Get Teacher
        # --------------------------------

        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {"success": False, "error": "Teacher not found."},
                status=404
            )

        # --------------------------------
        # Get Class
        # --------------------------------

        school_class = SchoolClass.objects.filter(
            id=class_id
        ).first()

        if not school_class:
            return Response(
                {"success": False, "error": "Class not found."},
                status=404
            )

        # --------------------------------
        # Get Section
        # --------------------------------

        section_obj = Section.objects.filter(
            id=section_id,
            school_class=school_class
        ).first()

        if not section_obj:
            return Response(
                {
                    "success": False,
                    "error": "Section not found for this class."
                },
                status=404
            )

        # --------------------------------
        # Get Subject
        # --------------------------------

        subject_obj = Subject.objects.filter(
            id=subject_id,
            is_active=True
        ).first()

        if not subject_obj:
            return Response(
                {"success": False, "error": "Subject not found."},
                status=404
            )

        # --------------------------------
        # Verify Teacher Allocation
        # --------------------------------

        allocation = TeacherSubjectAllocation.objects.filter(
            teacher=teacher,
            school_class=school_class,
            section=section_obj,
            subject=subject_obj
        ).first()

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "Access denied. You are not assigned "
                        "to this class, section and subject."
                    )
                },
                status=403
            )

        # --------------------------------
        # Validate Total Marks
        # --------------------------------

        try:
            total_marks = float(total_marks)
        except (ValueError, TypeError):
            return Response(
                {
                    "success": False,
                    "error": "Total marks must be numeric."
                },
                status=400
            )

        if total_marks <= 0:
            return Response(
                {
                    "success": False,
                    "error": "Total marks must be greater than 0."
                },
                status=400
            )

        # --------------------------------
        # Get Students
        # --------------------------------

        students = Student.objects.filter(
            school_class=school_class,
            section=section_obj,
            is_active=True
        )

        student_map = {
            str(student.id): student
            for student in students
        }

        # --------------------------------
        # Save Marks
        # --------------------------------

        saved_count = 0
        skipped_count = 0
        errors = []

        with transaction.atomic():

            for item in marks_list:

                student_id = item.get("student_id")
                marks_obtained = item.get("marks_obtained")

                if not student_id:
                    skipped_count += 1
                    continue

                if marks_obtained in [None, ""]:
                    skipped_count += 1
                    continue

                student = student_map.get(str(student_id))

                if not student:
                    errors.append({
                        "student_id": student_id,
                        "error": (
                            "Student does not belong to "
                            "this class and section."
                        )
                    })
                    continue

                try:
                    marks_obtained = float(marks_obtained)
                except (ValueError, TypeError):
                    errors.append({
                        "student_id": student_id,
                        "error": "Marks must be numeric."
                    })
                    continue

                if marks_obtained < 0:
                    errors.append({
                        "student_id": student_id,
                        "error": "Marks cannot be negative."
                    })
                    continue

                if marks_obtained > total_marks:
                    errors.append({
                        "student_id": student_id,
                        "error": (
                            "Obtained marks cannot exceed "
                            "total marks."
                        )
                    })
                    continue

                ExamMark.objects.update_or_create(
                    student=student,
                    subject=subject_obj,
                    exam_name=exam_name,
                    defaults={
                        "marks_obtained": marks_obtained,
                        "total_marks": total_marks,
                        "teacher": teacher
                    }
                )

                saved_count += 1

        # --------------------------------
        # Response
        # --------------------------------

        return Response(
            {
                "success": True,
                "message": "Class marks saved successfully.",

                "class": {
                    "id": school_class.id,
                    "name": school_class.name
                },

                "section": {
                    "id": section_obj.id,
                    "name": section_obj.name
                },

                "subject": {
                    "id": subject_obj.id,
                    "name": subject_obj.name,
                    "code": subject_obj.code
                },

                "exam_name": exam_name,
                "total_marks": total_marks,

                "saved_count": saved_count,
                "skipped_count": skipped_count,
                "error_count": len(errors),
                "errors": errors
            },
            status=200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_attendance_api(request):
    try:
        employee_id = request.data.get("employeeId")
        class_id = request.data.get("classId")
        section_id = request.data.get("sectionId")
        subject_id = request.data.get("subjectId")
        attendance_date = request.data.get("date")
        attendance_list = request.data.get("attendance")

        if not employee_id:
            return Response(
                {
                    "success": False,
                    "error": "employeeId is required."
                },
                status=400
            )

        if not class_id:
            return Response(
                {
                    "success": False,
                    "error": "classId is required."
                },
                status=400
            )

        if not section_id:
            return Response(
                {
                    "success": False,
                    "error": "sectionId is required."
                },
                status=400
            )

        if not subject_id:
            return Response(
                {
                    "success": False,
                    "error": "subjectId is required."
                },
                status=400
            )

        if not attendance_date:
            return Response(
                {
                    "success": False,
                    "error": "date is required."
                },
                status=400
            )

        if not isinstance(attendance_list, list):
            return Response(
                {
                    "success": False,
                    "error": "attendance must be a list."
                },
                status=400
            )

        # -------------------------------------------------
        # 1. Get Teacher
        # -------------------------------------------------

        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found."
                },
                status=404
            )

        # -------------------------------------------------
        # 2. Verify exact Teacher/Class/Section/Subject
        # -------------------------------------------------

        allocation = (
            TeacherSubjectAllocation.objects
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject",
            )
            .filter(
                teacher=teacher,
                school_class_id=class_id,
                section_id=section_id,
                subject_id=subject_id,
            )
            .first()
        )

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "You are not assigned to this "
                        "class, section and subject."
                    )
                },
                status=403
            )

        # -------------------------------------------------
        # 3. Verify section belongs to selected class
        # -------------------------------------------------

        if allocation.section.school_class_id != allocation.school_class_id:
            return Response(
                {
                    "success": False,
                    "error": "Invalid class and section combination."
                },
                status=400
            )

        # -------------------------------------------------
        # 4. Verify students
        # -------------------------------------------------

        student_ids = []

        for item in attendance_list:

            student_id = item.get("studentId")

            if not student_id:
                return Response(
                    {
                        "success": False,
                        "error": "Each attendance record requires studentId."
                    },
                    status=400
                )

            student_ids.append(student_id)

        students = Student.objects.filter(
            id__in=student_ids,
            school_class_id=class_id,
            section_id=section_id,
            is_active=True,
        )

        students_map = {
            student.id: student
            for student in students
        }

        # -------------------------------------------------
        # 5. Make sure every student belongs to this class
        # -------------------------------------------------

        invalid_students = [
            student_id
            for student_id in student_ids
            if student_id not in students_map
        ]

        if invalid_students:
            return Response(
                {
                    "success": False,
                    "error": (
                        "One or more students do not belong "
                        "to the assigned class and section."
                    ),
                    "invalidStudents": invalid_students,
                },
                status=403
            )

        # -------------------------------------------------
        # 6. Save attendance
        # -------------------------------------------------

        created_count = 0
        updated_count = 0

        for item in attendance_list:

            student_id = item.get("studentId")
            status = item.get("status")

            if status not in ["Present", "Absent"]:
                return Response(
                    {
                        "success": False,
                        "error": (
                            "Attendance status must be "
                            "'Present' or 'Absent'."
                        )
                    },
                    status=400
                )

            attendance, created = Attendance.objects.update_or_create(
                student_id=student_id,
                date=attendance_date,
                subject_id=subject_id,
                defaults={
                    "status": status,
                    "teacher": teacher,
                }
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        # -------------------------------------------------
        # 7. Response
        # -------------------------------------------------

        return Response(
            {
                "success": True,
                "message": "Attendance saved successfully.",
                "teacher": {
                    "employeeId": teacher.employee_id,
                    "name": teacher.name,
                },
                "class": {
                    "id": allocation.school_class.id,
                    "name": allocation.school_class.name,
                },
                "section": {
                    "id": allocation.section.id,
                    "name": allocation.section.name,
                },
                "subject": {
                    "id": allocation.subject.id,
                    "name": allocation.subject.name,
                    "code": allocation.subject.code,
                },
                "date": attendance_date,
                "created": created_count,
                "updated": updated_count,
                "total": len(attendance_list),
            },
            status=200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )

# Student sees his/her own attendance for a specific date.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_daily_attendance_api(request):
    """
    Logged-in student ki selected date ki attendance return karta hai.
    GET ?date=YYYY-MM-DD
    """

    student = Student.objects.filter(
        user=request.user,
        is_active=True,
    ).first()

    if not student:
        return Response(
            {
                "success": False,
                "error": "Student profile nahi mila.",
            },
            status=404,
        )

    date_value = request.query_params.get("date")
    attendance_date = timezone.localdate()

    if date_value:
        try:
            attendance_date = date.fromisoformat(date_value)
        except ValueError:
            return Response(
                {
                    "success": False,
                    "error": "Date format YYYY-MM-DD hona chahiye.",
                },
                status=400,
            )

    records = (
        Attendance.objects.filter(
            student=student,
            date=attendance_date,
        )
        .select_related("subject", "teacher")
        .order_by("subject__name")
    )

    attendance_list = [
        {
            "id": record.id,
            "date": record.date.isoformat(),
            "status": record.status,
            "subjectId": record.subject_id,
            "subject": str(record.subject),
            "teacher": str(record.teacher),
        }
        for record in records
    ]

    return Response(
        {
            "success": True,
            "studentId": student.student_id,
            "date": attendance_date.isoformat(),
            "count": len(attendance_list),
            "attendance": attendance_list,
        }
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_class_attendance_api(
    request,
    employee_id,
    class_id,
    section_id,
    subject_id,
):
    try:
        # -------------------------------------------------
        # 1. Get Teacher
        # -------------------------------------------------

        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found."
                },
                status=404
            )

        # -------------------------------------------------
        # 2. Verify exact allocation
        # -------------------------------------------------

        allocation = (
            TeacherSubjectAllocation.objects
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject",
            )
            .filter(
                teacher=teacher,
                school_class_id=class_id,
                section_id=section_id,
                subject_id=subject_id,
            )
            .first()
        )

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "You are not assigned to this "
                        "class, section and subject."
                    )
                },
                status=403
            )

        # -------------------------------------------------
        # 3. Optional date filter
        # -------------------------------------------------

        attendance_date = request.query_params.get("date")

        attendance_queryset = (
            Attendance.objects
            .filter(
                student__school_class_id=class_id,
                student__section_id=section_id,
                subject_id=subject_id,
            )
            .select_related(
                "student",
                "subject",
                "teacher",
            )
            .order_by(
                "-date",
                "student__student_id",
            )
        )

        if attendance_date:
            attendance_queryset = attendance_queryset.filter(
                date=attendance_date
            )

        # -------------------------------------------------
        # 4. Prepare response
        # -------------------------------------------------

        attendance_list = []

        for attendance in attendance_queryset:

            student = attendance.student

            attendance_list.append({
                "id": attendance.id,

                "studentId": student.id,

                "studentCode": student.student_id,

                "studentName": (
                    f"{student.first_name} "
                    f"{student.middle_name + ' ' if student.middle_name else ''}"
                    f"{student.last_name}"
                ).strip(),

                "date": attendance.date,

                "status": attendance.status,

                "subjectId": attendance.subject.id,

                "subject": attendance.subject.name,

                "subjectCode": attendance.subject.code,

                "teacherId": (
                    attendance.teacher.id
                    if attendance.teacher
                    else None
                ),

                "teacherName": (
                    attendance.teacher.name
                    if attendance.teacher
                    else ""
                ),
            })

        # -------------------------------------------------
        # 5. Response
        # -------------------------------------------------

        return Response({
            "success": True,

            "teacher": {
                "employeeId": teacher.employee_id,
                "name": teacher.name,
            },

            "class": {
                "id": allocation.school_class.id,
                "name": allocation.school_class.name,
            },

            "section": {
                "id": allocation.section.id,
                "name": allocation.section.name,
            },

            "subject": {
                "id": allocation.subject.id,
                "name": allocation.subject.name,
                "code": allocation.subject.code,
            },

            "date": attendance_date,

            "count": len(attendance_list),

            "attendance": attendance_list,
        })

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_assignment_api(request):
    try:
        # -----------------------------------
        # Get request data
        # -----------------------------------
        employee_id = request.data.get("employee_id")
        class_id = request.data.get("class_id")
        section_id = request.data.get("section_id")
        subject_id = request.data.get("subject_id")
        title = request.data.get("title")
        description = request.data.get("description", "")
        due_date = request.data.get("due_date")
        total_marks = request.data.get("total_marks", 100)
        assignments_pdf = request.FILES.get("assignments_pdf")

        # -----------------------------------
        # Validate required fields
        # -----------------------------------
        if not employee_id:
            return Response(
                {
                    "success": False,
                    "error": "Employee ID is required."
                },
                status=400
            )

        if not class_id:
            return Response(
                {
                    "success": False,
                    "error": "Class ID is required."
                },
                status=400
            )

        if not section_id:
            return Response(
                {
                    "success": False,
                    "error": "Section ID is required."
                },
                status=400
            )

        if not subject_id:
            return Response(
                {
                    "success": False,
                    "error": "Subject ID is required."
                },
                status=400
            )

        if not title:
            return Response(
                {
                    "success": False,
                    "error": "Assignment title is required."
                },
                status=400
            )

        if not due_date:
            return Response(
                {
                    "success": False,
                    "error": "Due date is required."
                },
                status=400
            )

        # -----------------------------------
        # Find teacher
        # -----------------------------------
        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found."
                },
                status=404
            )

        # -----------------------------------
        # Check teacher allocation
        # -----------------------------------
        allocation = (
            TeacherSubjectAllocation.objects
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject"
            )
            .filter(
                teacher=teacher,
                school_class_id=class_id,
                section_id=section_id,
                subject_id=subject_id
            )
            .first()
        )

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "Access denied. You are not assigned "
                        "to this class, section and subject."
                    )
                },
                status=403
            )

        # -----------------------------------
        # Create assignment
        # -----------------------------------
        assignment = Assignment.objects.create(
            title=title,
            description=description,
            school_class=allocation.school_class,
            section=allocation.section,
            subject=allocation.subject,
            teacher=teacher,
            due_date=due_date,
            total_marks=total_marks,
            assignments_pdf=assignments_pdf
        )

        # -----------------------------------
        # Success response
        # -----------------------------------
        return Response(
            {
                "success": True,
                "message": "Assignment created successfully.",
                "data": {
                    "id": assignment.id,
                    "title": assignment.title,
                    "description": assignment.description,
                    "classId": assignment.school_class.id,
                    "className": assignment.school_class.name,
                    "sectionId": assignment.section.id,
                    "section": assignment.section.name,
                    "subjectId": assignment.subject.id,
                    "subject": assignment.subject.name,
                    "subjectCode": assignment.subject.code,
                    "teacherId": teacher.id,
                    "employeeId": teacher.employee_id,
                    "teacher": teacher.name,
                    "assignments_pdf": (
    request.build_absolute_uri(assignment.assignments_pdf.url)
    if assignment.assignments_pdf else None
),
                    "dueDate": assignment.due_date,
                    "createdAt": assignment.created_at
                }
            },
            status=201
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


class MyAssignmentsView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser
    ]

    def get_teacher(self, request):
        return get_object_or_404(
            Teacher,
            user=request.user
        )

    # --------------------------------
    # GET: MY ASSIGNMENTS
    # --------------------------------
    def get(self, request, pk=None):

        teacher = self.get_teacher(request)

        if pk:
            assignment = get_object_or_404(
                Assignment,
                id=pk,
                teacher=teacher
            )

            serializer = AssignmentSerializer(
                assignment,
                context={"request": request}
            )

            return Response({
                "success": True,
                "data": serializer.data
            })

        assignments = Assignment.objects.filter(
            teacher=teacher
        ).select_related(
            "school_class",
            "section",
            "subject",
            "teacher"
        )

        serializer = AssignmentSerializer(
            assignments,
            many=True,
            context={"request": request}
        )

        return Response({
            "success": True,
            "count": assignments.count(),
            "data": serializer.data
        })

    # --------------------------------
    # PUT / PATCH: UPDATE ASSIGNMENT
    # --------------------------------
    def put(self, request, pk):

        return self.update_assignment(request, pk)

    def patch(self, request, pk):

        return self.update_assignment(request, pk)

    def update_assignment(self, request, pk):

        teacher = self.get_teacher(request)

        assignment = get_object_or_404(
            Assignment,
            id=pk,
            teacher=teacher
        )

        title = request.data.get(
            "title",
            assignment.title
        )

        description = request.data.get(
            "description",
            assignment.description
        )

        due_date_value = request.data.get(
            "due_date",
            assignment.due_date
        )

        total_marks = request.data.get(
            "total_marks",
            assignment.total_marks
        )

        class_id = request.data.get(
            "school_class",
            request.data.get(
                "class_id",
                assignment.school_class_id
            )
        )

        section_id = request.data.get(
            "section",
            request.data.get(
                "section_id",
                assignment.section_id
            )
        )

        subject_id = request.data.get(
            "subject",
            request.data.get(
                "subject_id",
                assignment.subject_id
            )
        )

        if not title:
            return Response({
                "success": False,
                "error": "Assignment title is required."
            }, status=400)

        if not due_date_value:
            return Response({
                "success": False,
                "error": "Due date is required."
            }, status=400)

        due_date = (
            due_date_value
            if hasattr(due_date_value, "year")
            else parse_date(str(due_date_value))
        )

        if not due_date:
            return Response({
                "success": False,
                "error": "Invalid due date."
            }, status=400)

        # Teacher allocation validation
        allocation = TeacherSubjectAllocation.objects.filter(
            teacher=teacher,
            school_class_id=class_id,
            section_id=section_id,
            subject_id=subject_id
        ).first()

        if not allocation:
            return Response({
                "success": False,
                "error": (
                    "You are not allocated to this "
                    "class, section and subject."
                )
            }, status=403)

        assignment.title = title
        assignment.description = description
        assignment.school_class = allocation.school_class
        assignment.section = allocation.section
        assignment.subject = allocation.subject
        assignment.due_date = due_date
        assignment.total_marks = total_marks

        # New PDF upload
        pdf_file = request.FILES.get("assignments_pdf")

        if pdf_file:
            assignment.assignments_pdf = pdf_file

        # Remove existing PDF if requested
        if str(request.data.get("remove_pdf", "")).lower() == "true":
            if assignment.assignments_pdf:
                assignment.assignments_pdf.delete(save=False)

            assignment.assignments_pdf = None

        assignment.save()

        serializer = AssignmentSerializer(
            assignment,
            context={"request": request}
        )

        return Response({
            "success": True,
            "message": "Assignment updated successfully.",
            "data": serializer.data
        })

    # --------------------------------
    # DELETE: DELETE ASSIGNMENT
    # --------------------------------
    def delete(self, request, pk):

        teacher = self.get_teacher(request)

        assignment = get_object_or_404(
            Assignment,
            id=pk,
            teacher=teacher
        )

        assignment.delete()

        return Response({
            "success": True,
            "message": "Assignment deleted successfully."
        })



class TeacherAssignmentSubmissionsView(APIView):

    permission_classes = [IsAuthenticated]

    def get_teacher(self, request):
        return get_object_or_404(
            Teacher,
            user=request.user
        )

    def get(self, request, assignment_id):

        teacher = self.get_teacher(request)

        assignment = get_object_or_404(
            Assignment,
            id=assignment_id,
            teacher=teacher
        )

        submissions = AssignmentSubmission.objects.filter(
            assignment=assignment
        ).select_related(
            "student",
            "assignment"
        ).order_by("-submitted_at")

        data = []

        for submission in submissions:

            file_url = None

            if submission.file:
                file_url = request.build_absolute_uri(
                    submission.file.url
                )

            data.append({
                "id": submission.id,
                "assignmentId": assignment.id,
                "assignmentTitle": assignment.title,
                "studentId": str(submission.student),
                "studentName": str(submission.student),
                "answerText": submission.answer_text,
                "file": file_url,
                "submittedAt": submission.submitted_at,
                "status": submission.status,
                "marks": submission.marks,
                "teacherFeedback": submission.teacher_feedback,
                "totalMarks": float(assignment.total_marks),
                "reviewedAt": submission.reviewed_at,
            })

        return Response({
            "success": True,
            "count": len(data),
            "data": data
        })


class ReviewAssignmentSubmissionView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, assignment_id, submission_id):

        teacher = get_object_or_404(
            Teacher,
            user=request.user
        )

        assignment = get_object_or_404(
            Assignment,
            id=assignment_id,
            teacher=teacher
        )

        submission = get_object_or_404(
            AssignmentSubmission,
            id=submission_id,
            assignment=assignment
        )

        marks = request.data.get("marks")
        teacher_feedback = request.data.get(
            "teacher_feedback", ""
        )

        if marks is None:
            return Response({
                "success": False,
                "message": "Marks are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            marks = Decimal(str(marks))
        except (InvalidOperation, ValueError):
            return Response({
                "success": False,
                "message": "Enter valid marks."
            }, status=status.HTTP_400_BAD_REQUEST)

        if marks < 0 or marks > assignment.total_marks:
            return Response({
                "success": False,
                "message": (
                    f"Marks must be between 0 and "
                    f"{assignment.total_marks}."
                )
            }, status=status.HTTP_400_BAD_REQUEST)

        submission.marks = marks
        submission.teacher_feedback = teacher_feedback
        submission.status = "Reviewed"
        submission.reviewed_at = timezone.now()

        submission.save(update_fields=[
            "marks",
            "teacher_feedback",
            "status",
            "reviewed_at"
        ])

        return Response({
            "success": True,
            "message": "Assignment evaluated successfully.",
            "data": {
                "submissionId": submission.id,
                "marks": float(submission.marks),
                "totalMarks": float(assignment.total_marks),
                "teacherFeedback": submission.teacher_feedback,
                "status": submission.status,
                "reviewedAt": submission.reviewed_at
            }
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_assignments_api(request, employee_id):
    try:
        # -----------------------------------
        # Find teacher
        # -----------------------------------
        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found."
                },
                status=404
            )

        # -----------------------------------
        # Get teacher assignments
        # -----------------------------------
        assignments = (
            Assignment.objects
            .filter(teacher=teacher)
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject"
            )
            .order_by("-created_at")
        )

        assignment_list = []

        for assignment in assignments:
            assignment_list.append(
                {
                    "id": assignment.id,
                    "title": assignment.title,
                    "description": assignment.description,

                    "classId": assignment.school_class.id,
                    "className": assignment.school_class.name,

                    "sectionId": assignment.section.id,
                    "section": assignment.section.name,

                    "subjectId": assignment.subject.id,
                    "subject": assignment.subject.name,
                    "subjectCode": assignment.subject.code,

                     "total_marks": assignment.total_marks,

                    "teacherId": teacher.id,
                    "employeeId": teacher.employee_id,
                    "teacher": teacher.name,

                    "dueDate": assignment.due_date,
                    "createdAt": assignment.created_at,
                    "updatedAt": assignment.updated_at,
                }
            )

        # -----------------------------------
        # Response
        # -----------------------------------
        return Response(
            {
                "success": True,

                "teacher": {
                    "id": teacher.id,
                    "employeeId": teacher.employee_id,
                    "name": teacher.name,
                },

                "count": len(assignment_list),

                "assignments": assignment_list,
            },
            status=200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


# teacher teacher_assignment_submissions
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_assignment_submissions_api(request, employee_id, assignment_id):
    try:
        # -----------------------------------
        # Get teacher
        # -----------------------------------
        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found."
                },
                status=404
            )

        # -----------------------------------
        # Get assignment
        # -----------------------------------
        assignment = (
            Assignment.objects
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject",
            )
            .filter(
                id=assignment_id,
                teacher=teacher,
            )
            .first()
        )

        if not assignment:
            return Response(
                {
                    "success": False,
                    "error": (
                        "Assignment not found or "
                        "you are not the assigned teacher."
                    )
                },
                status=404
            )

        # -----------------------------------
        # Get submissions
        # -----------------------------------
        submissions = (
            AssignmentSubmission.objects
            .filter(assignment=assignment)
            .select_related("student")
            .order_by("-submitted_at")
        )

        submission_list = []

        for submission in submissions:
            student = submission.student

            submission_list.append(
                {
                    "id": submission.id,

                    "studentId": student.student_id,

                    "studentName": (
                        f"{student.first_name} "
                        f"{student.middle_name + ' ' if student.middle_name else ''}"
                        f"{student.last_name}"
                    ).strip(),

                    "answerText": submission.answer_text,

                    "file": (
                        request.build_absolute_uri(
                            submission.file.url
                        )
                        if submission.file
                        else None
                    ),

                    "submittedAt": submission.submitted_at,

                    "status": submission.status,

                    "marks": submission.marks,

                    "teacherFeedback": submission.teacher_feedback,

                    "reviewedAt": submission.reviewed_at,
                }
            )

        # -----------------------------------
        # Response
        # -----------------------------------
        return Response(
            {
                "success": True,

                "assignment": {
                    "id": assignment.id,
                    "title": assignment.title,
                    "description": assignment.description,

                    "classId": assignment.school_class.id,
                    "className": assignment.school_class.name,

                    "sectionId": assignment.section.id,
                    "section": assignment.section.name,

                    "subjectId": assignment.subject.id,
                    "subject": assignment.subject.name,
                    "subjectCode": assignment.subject.code,

                    "dueDate": assignment.due_date,
                },

                "teacher": {
                    "id": teacher.id,
                    "employeeId": teacher.employee_id,
                    "name": teacher.name,
                },

                "count": len(submission_list),

                "submissions": submission_list,
            },
            status=200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_attendance_history_api(
    request,
    employee_id,
    class_id,
    section_id,
    subject_id
):
    try:
        date_value = request.query_params.get("date")

        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {"success": False, "error": "Teacher not found."},
                status=404
            )

        school_class = SchoolClass.objects.filter(
            id=class_id
        ).first()

        if not school_class:
            return Response(
                {"success": False, "error": "Class not found."},
                status=404
            )

        section_obj = Section.objects.filter(
            id=section_id,
            school_class=school_class
        ).first()

        if not section_obj:
            return Response(
                {
                    "success": False,
                    "error": "Section not found for this class."
                },
                status=404
            )

        subject_obj = Subject.objects.filter(
            id=subject_id,
            is_active=True
        ).first()

        if not subject_obj:
            return Response(
                {"success": False, "error": "Subject not found."},
                status=404
            )

        # --------------------------------
        # Verify teacher allocation
        # --------------------------------

        allocation = TeacherSubjectAllocation.objects.filter(
            teacher=teacher,
            school_class=school_class,
            section=section_obj,
            subject=subject_obj
        ).first()

        if not allocation:
            return Response(
                {
                    "success": False,
                    "error": (
                        "Access denied. You are not assigned "
                        "to this class, section and subject."
                    )
                },
                status=403
            )

        # --------------------------------
        # Get attendance
        # --------------------------------

        attendance_query = Attendance.objects.filter(
            student__school_class=school_class,
            student__section=section_obj,
            subject=subject_obj,
            teacher=teacher
        ).select_related(
            "student",
            "subject",
            "teacher"
        ).order_by(
            "-date",
            "student__student_id"
        )

        if date_value:
            attendance_query = attendance_query.filter(
                date=date_value
            )

        records = []

        for attendance in attendance_query:

            student = attendance.student

            student_name = (
                f"{student.first_name} "
                f"{student.middle_name + ' ' if student.middle_name else ''}"
                f"{student.last_name}"
            ).strip()

            records.append(
                {
                    "id": attendance.id,

                    "studentId": student.id,

                    "admissionId": student.student_id,

                    "studentName": student_name,

                    "date": attendance.date,

                    "status": attendance.status,

                    "subject": {
                        "id": subject_obj.id,
                        "name": subject_obj.name,
                        "code": subject_obj.code
                    },

                    "teacher": {
                        "employeeId": teacher.employee_id,
                        "name": teacher.name
                    }
                }
            )

        return Response(
            {
                "success": True,

                "teacher": {
                    "employeeId": teacher.employee_id,
                    "name": teacher.name
                },

                "class": {
                    "id": school_class.id,
                    "name": school_class.name
                },

                "section": {
                    "id": section_obj.id,
                    "name": section_obj.name
                },

                "subject": {
                    "id": subject_obj.id,
                    "name": subject_obj.name,
                    "code": subject_obj.code
                },

                "date": date_value,

                "count": len(records),

                "records": records
            },
            status=200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )    


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def teacher_dashboard_api(request, employee_id):
    try:
      
        teacher = Teacher.objects.filter(
            employee_id=employee_id
        ).first()

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found."
                },
                status=404
            )

        today = timezone.localdate()

        # --------------------------------
        # Teacher Allocations
        # --------------------------------

        allocations = TeacherSubjectAllocation.objects.filter(
            teacher=teacher
        ).select_related(
            "school_class",
            "section",
            "subject"
        ).order_by(
            "school_class__display_order",
            "section__name",
            "subject__name"
        )

        # --------------------------------
        # Assigned Class Data
        # --------------------------------

        assigned_classes = []

        total_students = 0
        total_attendance_records = 0
        today_present = 0
        today_absent = 0

        allocation_ids = []

        for allocation in allocations:

            allocation_ids.append(allocation.id)

            students = Student.objects.filter(
                school_class=allocation.school_class,
                section=allocation.section,
                is_active=True
            )

            student_count = students.count()

            # Today's attendance for this allocation
            today_attendance = Attendance.objects.filter(
                teacher=teacher,
                subject=allocation.subject,
                student__school_class=allocation.school_class,
                student__section=allocation.section,
                date=today
            )

            present_count = today_attendance.filter(
                status="Present"
            ).count()

            absent_count = today_attendance.filter(
                status="Absent"
            ).count()

            total_students += student_count
            today_present += present_count
            today_absent += absent_count

            assigned_classes.append(
                {
                    "allocationId": allocation.id,

                    "class": {
                        "id": allocation.school_class.id,
                        "name": allocation.school_class.name
                    },

                    "section": {
                        "id": allocation.section.id,
                        "name": allocation.section.name
                    },

                    "subject": {
                        "id": allocation.subject.id,
                        "name": allocation.subject.name,
                        "code": allocation.subject.code
                    },

                    "studentCount": student_count,

                    "todayAttendance": {
                        "present": present_count,
                        "absent": absent_count,
                        "total": present_count + absent_count
                    }
                }
            )

        # --------------------------------
        # Attendance Percentage Today
        # --------------------------------

        today_total = today_present + today_absent

        today_attendance_percentage = 0

        if today_total > 0:
            today_attendance_percentage = round(
                (today_present / today_total) * 100,
                2
            )

        # --------------------------------
        # Assignments
        # --------------------------------

        assignments = Assignment.objects.filter(
            teacher=teacher
        ).select_related(
            "school_class",
            "section",
            "subject"
        ).order_by(
            "-created_at"
        )

        total_assignments = assignments.count()

        # Recent assignments
        recent_assignments = []

        for assignment in assignments[:5]:

            submission_count = AssignmentSubmission.objects.filter(
                assignment=assignment
            ).count()

            reviewed_count = AssignmentSubmission.objects.filter(
                assignment=assignment,
                status="Reviewed"
            ).count()

            recent_assignments.append(
                {
                    "id": assignment.id,
                    "title": assignment.title,
                    "description": assignment.description,

                    "class": assignment.school_class.name,

                    "section": assignment.section.name,

                    "subject": {
                        "id": assignment.subject.id,
                        "name": assignment.subject.name,
                        "code": assignment.subject.code
                    },

                    "dueDate": assignment.due_date,

                    "submissionCount": submission_count,

                    "reviewedCount": reviewed_count,

                    "createdAt": assignment.created_at
                }
            )

        # --------------------------------
        # Assignment Submissions
        # --------------------------------

        teacher_assignments = assignments.values_list(
            "id",
            flat=True
        )

        total_submissions = AssignmentSubmission.objects.filter(
            assignment_id__in=teacher_assignments
        ).count()

        pending_submissions = AssignmentSubmission.objects.filter(
            assignment_id__in=teacher_assignments
        ).exclude(
            status="Reviewed"
        ).count()

        reviewed_submissions = AssignmentSubmission.objects.filter(
            assignment_id__in=teacher_assignments,
            status="Reviewed"
        ).count()

        # --------------------------------
        # Exam Marks Statistics
        # --------------------------------

        # teacher_exam_marks = ExamMark.objects.filter(
        #     teacher=teacher
        # )

        # total_exam_marks = teacher_exam_marks.count()

        # marked_students = teacher_exam_marks.values(
        #     "student_id"
        # ).distinct().count()

        # exam_count = teacher_exam_marks.values(
        #     "exam_name"
        # ).distinct().count()

        # --------------------------------
        # Today's Attendance Records
        # --------------------------------

        total_attendance_records = Attendance.objects.filter(
            teacher=teacher,
            date=today
        ).count()

        # --------------------------------
        # Response
        # --------------------------------

        return Response(
            {
                "success": True,

                "teacher": {
                    "id": teacher.id,
                    "employeeId": teacher.employee_id,
                    "name": teacher.name,
                    "email": (
                        teacher.user.email
                        if teacher.user
                        else teacher.email or ""
                    ),
                    "phone": teacher.phone or "",
                    "department": teacher.department,
                    "primarySubject": teacher.primary_subject,
                    "qualification": teacher.qualification or "",
                    "mustChangePassword": teacher.must_change_password
                },

                "date": today,

                "statistics": {
                    "totalAssignedClasses": len(assigned_classes),

                    "totalStudents": total_students,

                    "todayAttendance": {
                        "present": today_present,
                        "absent": today_absent,
                        "total": today_total,
                        "percentage": today_attendance_percentage
                    },

                    "attendanceRecordsToday": (
                        total_attendance_records
                    ),

                    "totalAssignments": total_assignments,

                    "assignmentSubmissions": {
                        "total": total_submissions,
                        "pending": pending_submissions,
                        "reviewed": reviewed_submissions
                    },

                    # "examMarks": {
                    #     "totalMarks": total_exam_marks,
                    #     "studentsMarked": marked_students,
                    #     "exams": exam_count
                    # }
                },

                "assignedClasses": assigned_classes,

                "recentAssignments": recent_assignments
            },
            status=200
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_teacher_timetable_api(request, employee_id):

    try:

        teacher = (
            Teacher.objects
            .filter(
                employee_id=employee_id
            )
            .first()
        )

        if not teacher:
            return Response(
                {
                    "success": False,
                    "error": "Teacher not found.",
                },
                status=404,
            )

        day = request.query_params.get(
            "day"
        )

        timetable_query = (
            Timetable.objects
            .filter(
                teacher=teacher,
                is_active=True,
            )
            .select_related(
                "academic_year",
                "school_class",
                "section",
                "subject",
            )
            .order_by(
                "day",
                "start_time",
            )
        )

        if day:
            timetable_query = timetable_query.filter(
                day=day.upper()
            )

        timetable = []

        for item in timetable_query:

            timetable.append(
                {
                    "id": item.id,

                    "day": item.day,

                    "startTime": item.start_time,

                    "endTime": item.end_time,

                    "roomNumber": item.room_number,

                    "academicYear": {
                        "id": item.academic_year.id,
                        "name": item.academic_year.name,
                    },

                    "class": {
                        "id": item.school_class.id,
                        "name": item.school_class.name,
                    },

                    "section": {
                        "id": item.section.id,
                        "name": item.section.name,
                    },

                    "subject": {
                        "id": item.subject.id,
                        "name": item.subject.name,
                        "code": item.subject.code,
                    },
                }
            )

        return Response(
            {
                "success": True,

                "teacher": {
                    "id": teacher.id,
                    "employeeId": teacher.employee_id,
                    "name": teacher.name,
                },

                "day": day.upper() if day else None,

                "count": len(timetable),

                "timetable": timetable,
            },
            status=200,
        )

    except Exception as e:

        return Response(
            {
                "success": False,
                "error": str(e),
            },
            status=500,
        )