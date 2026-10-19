from django.urls import path

from .views import (
    teacher_register_api,
    teacher_login_api,
    teacher_detail_api,
    teacher_class_students_api,
    enter_exam_marks_api,
    mark_attendance_api,
    create_assignment_api,
    pending_teachers_list,
    approve_teacher_api,
    admin_teachers_list,
    add_bulk_exam_marks_api,
    get_class_attendance_api,
    admin_teacher_detail,
    admin_teacher_update,
    TeacherSubjectAllocationListCreateView,
    teacher_subject_students_api,
    teacher_assignments_api,
    teacher_assignment_submissions_api,
    review_assignment_submission_api,
    teacher_exam_marks_api,
    teacher_attendance_history_api,
    teacher_dashboard_api,
    my_teacher_timetable_api,

    
    teacher_my_courses_api,
)


urlpatterns = [

    # =====================================================
    # TEACHER REGISTRATION & LOGIN
    # =====================================================

    path(
        "register/",
        teacher_register_api,
        name="teacher-register",
    ),

    path(
        "login/",
        teacher_login_api,
        name="teacher-login",
    ),


    # =====================================================
    # ADMIN - TEACHER MANAGEMENT
    # =====================================================

    path(
        "admin/pending-teacher/",
        pending_teachers_list,
        name="pending-teachers",
    ),

    path(
        "admin/teachers/",
        admin_teachers_list,
        name="admin-teachers",
    ),

    path(
        "admin/approve-teacher/<int:teacher_id>/",
        approve_teacher_api,
        name="approve-teacher",
    ),

    path(
        "admin/teachers/<str:employee_id>/",
        admin_teacher_detail,
        name="admin-teacher-detail",
    ),

    path(
        "admin/teachers/<str:employee_id>/update/",
        admin_teacher_update,
        name="admin-teacher-update",
    ),


    # =====================================================
    # TEACHER SUBJECT / CLASS ALLOCATION
    # =====================================================

    path(
        "subject-allocations/",
        TeacherSubjectAllocationListCreateView.as_view(),
        name="teacher-subject-allocation-list-create",
    ),


    # =====================================================
    # TEACHER DASHBOARD
    # =====================================================

    path(
        "<str:employee_id>/dashboard/",
        teacher_dashboard_api,
        name="teacher-dashboard",
    ),

    path(
        "<str:employee_id>/timetable/",
        my_teacher_timetable_api,
        name="my-teacher-timetable",
    ),

     path(
    "my-courses/",
    teacher_my_courses_api,
    name="teacher-my-courses",
),

    # =====================================================
    # TEACHER STUDENTS
    # =====================================================

    path(
        "<str:employee_id>/class/<str:class_name>/<str:section>/students/",
        teacher_class_students_api,
        name="teacher-students",
    ),

    path(
        "<str:employee_id>/class/<str:class_name>/<str:section>/subject/<int:subject_id>/students/",
        teacher_subject_students_api,
        name="teacher-subject-students",
    ),


    # =====================================================
    # EXAM MARKS
    # =====================================================

    path(
        "marks/add/",
        enter_exam_marks_api,
        name="add-marks",
    ),

    path(
        "marks/add-bulk/",
        add_bulk_exam_marks_api,
        name="add-bulk-marks",
    ),

    path(
        "<str:employee_id>/exam-marks/<int:class_id>/<int:section_id>/<int:subject_id>/",
        teacher_exam_marks_api,
        name="teacher-exam-marks",
    ),


    # =====================================================
    # ATTENDANCE
    # =====================================================

    path(
        "attendance/mark-bulk/",
        mark_attendance_api,
        name="mark-attendance",
    ),

    path(
        "attendance/<str:employee_id>/<int:class_id>/<int:section_id>/<int:subject_id>/",
        get_class_attendance_api,
        name="class-attendance",
    ),

    path(
        "attendance-history/<str:employee_id>/<int:class_id>/<int:section_id>/<int:subject_id>/",
        teacher_attendance_history_api,
        name="teacher-attendance-history",
    ),


    # =====================================================
    # ASSIGNMENTS
    # =====================================================

    path(
        "assignment/create/",
        create_assignment_api,
        name="create-assignment",
    ),

    path(
        "<str:employee_id>/assignments/",
        teacher_assignments_api,
        name="teacher-assignments",
    ),

    path(
        "<str:employee_id>/assignments/<int:assignment_id>/submissions/",
        teacher_assignment_submissions_api,
        name="teacher-assignment-submissions",
    ),

    path(
        "<str:employee_id>/assignments/<int:assignment_id>/submissions/<int:submission_id>/review/",
        review_assignment_submission_api,
        name="review-assignment-submission",
    ),


    # =====================================================
    # TEACHER PROFILE
    # =====================================================
    # Keep this generic route LAST.

    path(
        "<str:employee_id>/",
        teacher_detail_api,
        name="teacher-detail",
    ),
]