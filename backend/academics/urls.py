from django.urls import path

from .views import (
    MyStudentSubjectsView,
    SubjectListCreateView,
    ClassSubjectListCreateView,
    AcademicYearListAPIView,
    SchoolClassListAPIView,
   
)

from .timetable_views import (
    AdminTimetableListCreateView,
    AdminTimetableDetailView,
    TimetableReadOnlyListView,
)



from .admin_views import (
    AdminAcademicYearView,
    AdminAcademicYearDetailView,
    AdminSchoolClassView,
    AdminSchoolClassDetailView,
    AdminSectionView,
    AdminSectionDetailView,
    AdminSubjectView,
    AdminSubjectDetailView,
    AdminClassSubjectView,
    AdminClassSubjectDetailView,
    AdminTeacherSubjectAllocationView,
    AdminTeacherSubjectAllocationDetailView,
    AdminBulkTeacherSubjectAllocationView
)



urlpatterns = [


path(
    "admin/timetables/",
    AdminTimetableListCreateView.as_view(),
    name="admin-timetable-list-create",
),
path(
    "admin/timetables/<int:pk>/",
    AdminTimetableDetailView.as_view(),
    name="admin-timetable-detail",
),
path(
    "timetables/",
    TimetableReadOnlyListView.as_view(),
    name="timetable-read-only",
),
    
# Separate School Admin CRUD APIs
path("admin/years/", AdminAcademicYearView.as_view()),
path("admin/years/<int:pk>/", AdminAcademicYearDetailView.as_view()),

path("admin/classes/", AdminSchoolClassView.as_view()),
path("admin/classes/<int:pk>/", AdminSchoolClassDetailView.as_view()),

path("admin/sections/", AdminSectionView.as_view()),
path("admin/sections/<int:pk>/", AdminSectionDetailView.as_view()),

path("admin/subjects/", AdminSubjectView.as_view()),
path("admin/subjects/<int:pk>/", AdminSubjectDetailView.as_view()),

path("admin/class-subjects/", AdminClassSubjectView.as_view()),
path("admin/class-subjects/<int:pk>/", AdminClassSubjectDetailView.as_view()),

path(
    "admin/teacher-allocations/",
    AdminTeacherSubjectAllocationView.as_view(),
),

# path(
#     "admin/teacher-allocations/bulk/",
#     AdminBulkTeacherSubjectAllocationView.as_view(),
#     name="admin-bulk-teacher-subject-allocations",
# ),

path(
    "admin/teacher-allocations/<int:pk>/",
    AdminTeacherSubjectAllocationDetailView.as_view(),
),

path(
    "admin/teacher-allocations/bulk/",
    AdminBulkTeacherSubjectAllocationView.as_view(),
    name="admin-bulk-teacher-subject-allocations",
),

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