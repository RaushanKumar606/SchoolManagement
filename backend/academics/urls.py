from django.urls import path

from .views import (
    MyStudentSubjectsView,
    SubjectListCreateView,
    ClassSubjectListCreateView,
    AcademicYearListAPIView,
    SchoolClassListAPIView,
    SectionListAPIView,
)


urlpatterns = [

    # Subject Master
    path(
        "subjects/",
        SubjectListCreateView.as_view(),
        name="subject-list-create",
    ),
    path(
            "years/",
            AcademicYearListAPIView.as_view(),
            name="academic-year",
        ),
    path(
                "classes/",
                SchoolClassListAPIView.as_view(),
                name="class-list-create",
            ),
    path(
                    "section/",
                    SectionListAPIView.as_view(),
                    name="section-list-create",
                ),

    # Assign Subject to Class
    path(
        "class-subjects/",
        ClassSubjectListCreateView.as_view(),
        name="class-subject-list-create",
    ),

    # Student Subjects
    path(
        "student/my-subjects/",
        MyStudentSubjectsView.as_view(),
        name="student-my-subjects",
    ),
]