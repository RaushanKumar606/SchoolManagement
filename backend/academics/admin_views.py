
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import (
    AcademicYear,
    SchoolClass,
    Section,
    Subject,
    ClassSubject,
)

from rest_framework.response import Response
from rest_framework import status


from rest_framework import serializers, generics
from rest_framework.exceptions import ValidationError
from teacher.models import TeacherSubjectAllocation

from teacher.models import Teacher, TeacherSubjectAllocation

from .serializers import (
    AcademicYearSerializer,
    SchoolClassSerializer,
    SectionSerializer,
    SubjectSerializer,
    ClassSubjectSerializer,
    TeacherSubjectAllocationSerializer,
    BulkTeacherSubjectAllocationSerializer
)

from .permissions import IsSchoolAdminOrSuperAdmin


# =========================================================
# ACADEMIC YEAR - LIST, CREATE, UPDATE, DELETE
# =========================================================

class AdminAcademicYearView(generics.ListCreateAPIView):
    serializer_class = AcademicYearSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]

    def get_queryset(self):
        return AcademicYear.objects.all().order_by(
            "-is_active",
            "-start_date",
            "name",
        )


class AdminAcademicYearDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]


# =========================================================
# SCHOOL CLASS - LIST, CREATE, UPDATE, DELETE
# =========================================================

class AdminSchoolClassView(generics.ListCreateAPIView):
    serializer_class = SchoolClassSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]

    def get_queryset(self):
        queryset = SchoolClass.objects.select_related(
            "academic_year"
        ).all()

        academic_year = self.request.query_params.get("academic_year")

        if academic_year:
            queryset = queryset.filter(
                academic_year_id=academic_year
            )

        return queryset.order_by("display_order", "name")


class AdminSchoolClassDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = SchoolClass.objects.select_related("academic_year")
    serializer_class = SchoolClassSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]


# =========================================================
# SECTION - LIST, CREATE, UPDATE, DELETE
# =========================================================

class AdminSectionView(generics.ListCreateAPIView):
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]

    def get_queryset(self):
        queryset = Section.objects.select_related(
            "school_class",
            "school_class__academic_year",
        ).all()

        school_class = self.request.query_params.get("school_class")

        if school_class:
            queryset = queryset.filter(
                school_class_id=school_class
            )

        return queryset.order_by("name")


class AdminSectionDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Section.objects.select_related("school_class")
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]


# =========================================================
# SUBJECT - LIST, CREATE, UPDATE, DELETE
# =========================================================

class AdminSubjectView(generics.ListCreateAPIView):
    queryset = Subject.objects.all().order_by("name")
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]


class AdminSubjectDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]


# =========================================================
# CLASS SUBJECT - ASSIGN SUBJECTS TO CLASSES
# =========================================================

class AdminClassSubjectView(generics.ListCreateAPIView):
    serializer_class = ClassSubjectSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]

    def get_queryset(self):
        queryset = ClassSubject.objects.select_related(
            "school_class",
            "subject",
        ).all()

        school_class = self.request.query_params.get("school_class")

        if school_class:
            queryset = queryset.filter(
                school_class_id=school_class
            )

        return queryset.order_by(
            "school_class__display_order",
            "subject__name",
        )


class AdminClassSubjectDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = ClassSubject.objects.select_related(
        "school_class",
        "subject",
    )
    serializer_class = ClassSubjectSerializer
    permission_classes = [IsAuthenticated, IsSchoolAdminOrSuperAdmin]



class AdminTeacherSubjectAllocationView(generics.ListCreateAPIView):
    serializer_class = TeacherSubjectAllocationSerializer
    permission_classes = [
        IsAuthenticated,
        IsSchoolAdminOrSuperAdmin,
    ]

    def get_queryset(self):
        queryset = TeacherSubjectAllocation.objects.select_related(
            "teacher",
            "school_class",
            "school_class__academic_year",
            "section",
            "subject",
        ).all()

        school_class = self.request.query_params.get("school_class")
        section = self.request.query_params.get("section")
        subject = self.request.query_params.get("subject")

        if school_class:
            queryset = queryset.filter(school_class_id=school_class)

        if section:
            queryset = queryset.filter(section_id=section)

        if subject:
            queryset = queryset.filter(subject_id=subject)

        return queryset.order_by(
            "school_class__name",
            "section__name",
            "subject__name",
        )


class AdminTeacherSubjectAllocationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = TeacherSubjectAllocation.objects.select_related(
        "teacher",
        "school_class",
        "section",
        "subject",
    )
    serializer_class = TeacherSubjectAllocationSerializer
    permission_classes = [
        IsAuthenticated,
        IsSchoolAdminOrSuperAdmin,
    ]

class AdminBulkTeacherSubjectAllocationView(generics.GenericAPIView):
    serializer_class = BulkTeacherSubjectAllocationSerializer
    permission_classes = [
        IsAuthenticated,
        IsSchoolAdminOrSuperAdmin,
    ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        allocations = serializer.save()

        return Response(
            {
                "message": "Subjects assigned successfully.",
                "count": len(allocations),
                "allocations": [
                    {
                        "id": allocation.id,
                        "teacher": allocation.teacher_id,
                        "school_class": allocation.school_class_id,
                        "section": allocation.section_id,
                        "subject": allocation.subject_id,
                    }
                    for allocation in allocations
                ],
            },
            status=status.HTTP_201_CREATED,
        )

