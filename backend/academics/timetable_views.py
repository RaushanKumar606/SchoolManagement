
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from academics.models import Timetable
from students.models import Student
from teacher.models import Teacher

from .permissions import (
    TimetableAdminPermission,
    TimetablePermission,
)
from .timetable_serializers import TimetableSerializer


class AdminTimetableListCreateView(generics.ListCreateAPIView):
    serializer_class = TimetableSerializer
    permission_classes = [
        IsAuthenticated,
        TimetableAdminPermission,
    ]

    def get_queryset(self):
        queryset = Timetable.objects.select_related(
            "academic_year",
            "school_class",
            "section",
            "subject",
            "teacher",
        ).order_by(
            "school_class__display_order",
            "section__name",
            "day",
            "start_time",
        )

        params = self.request.query_params

        filters = {
            "academic_year": "academic_year_id",
            "school_class": "school_class_id",
            "section": "section_id",
            "teacher": "teacher_id",
            "day": "day",
        }

        for param, field in filters.items():
            value = params.get(param)
            if value:
                queryset = queryset.filter(**{field: value})

        return queryset


class AdminTimetableDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = TimetableSerializer
    permission_classes = [
        IsAuthenticated,
        TimetableAdminPermission,
    ]

    queryset = Timetable.objects.select_related(
        "academic_year",
        "school_class",
        "section",
        "subject",
        "teacher",
    )


class TimetableReadOnlyListView(generics.ListAPIView):
    serializer_class = TimetableSerializer
    permission_classes = [
        IsAuthenticated,
        TimetablePermission,
    ]

    def get_queryset(self):
        user = self.request.user
        role = str(getattr(user, "role", "")).upper()

        queryset = Timetable.objects.filter(
            is_active=True
        ).select_related(
            "academic_year",
            "school_class",
            "section",
            "subject",
            "teacher",
        )

        params = self.request.query_params

        day = params.get("day")
        if day:
            queryset = queryset.filter(day=day.upper())

        if role in {"SCHOOL_ADMIN", "SUPER_ADMIN"} or user.is_superuser:
            school_class = params.get("school_class")
            section = params.get("section")
            academic_year = params.get("academic_year")

            if school_class:
                queryset = queryset.filter(
                    school_class_id=school_class
                )

            if section:
                queryset = queryset.filter(section_id=section)

            if academic_year:
                queryset = queryset.filter(
                    academic_year_id=academic_year
                )

        elif role == "TEACHER":
            teacher = Teacher.objects.filter(
                user=user
            ).first()

            if not teacher:
                return Timetable.objects.none()

            queryset = queryset.filter(
                teacher=teacher
            )

        elif role == "STUDENT":
            student = Student.objects.filter(
                user=user,
                is_active=True,
            ).first()

            if not student:
                return Timetable.objects.none()

            queryset = queryset.filter(
                academic_year=student.academic_year,
                school_class=student.school_class,
                section=student.section,
            )

        else:
            return Timetable.objects.none()

        return queryset.order_by("day", "start_time")
