from django.urls import path

from .views import (
    MyStudentProfileView,
    MySubjectsView,
    student_dashboard_api,
    my_student_assignments_api,
    submit_assignment_api,
    my_exam_results_api,
    my_exam_result_detail_api,
    my_attendance_summary_api,
    my_student_timetable_api,
    AdminStudentListView,
    AdminStudentDetailView,
    student_daily_attendance_api
)


urlpatterns = [

    path(
        "me/",
        MyStudentProfileView.as_view(),
        name="my-student-profile",
    ),

    path(
    "my-attendance/",
    student_daily_attendance_api,
    name="student-daily-attendance",
),
    path(
    "admin/students/<int:pk>/",
    AdminStudentDetailView.as_view(),
    name="admin-student-detail",
),

    path(
    "admin/students/",
    AdminStudentListView.as_view(),
    name="admin-student-list",
),

     path(
        "dashboard/",
        student_dashboard_api,
        name="student-dashboard",
    ),

    path(
        "my-subjects/",
        MySubjectsView.as_view(),
        name="my-student-subjects",
    ),
    path(
    "my-assignments/",
    my_student_assignments_api,
    name="my-student-assignments",
),

path(
    "assignments/<int:assignment_id>/submit/",
    submit_assignment_api,
    name="submit-assignment",
),

 path(
    "my-exam-results/",
    my_exam_results_api,
    name="my-exam-results"
),

path(
    "my-exam-result/<str:exam_name>/",
    my_exam_result_detail_api,
    name="my-exam-result-detail"
),
path(
    "my-attendance/",
    my_attendance_summary_api,
    name="my-attendance"
),

path(
    "my-timetable/",
    my_student_timetable_api,
    name="my-student-timetable",
),

]