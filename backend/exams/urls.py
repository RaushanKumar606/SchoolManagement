
from django.urls import path


from .views import (
    exam_list_create_api,
    publish_exam_results_api,
    student_published_results_api,
    teacher_exam_marks_api,
    release_admit_card_api,
    student_admit_cards_api,
    publish_exam_timetable_api,
    exam_schedules_api,
    exam_available_subjects_api,
)

urlpatterns = [
    path("", exam_list_create_api, name="exam-list-create"),


path(
    "<int:exam_id>/timetable/publish/",
    publish_exam_timetable_api,
    name="publish-exam-timetable",
),
    path(
    "student/admit-cards/",
    student_admit_cards_api,
    name="student-admit-cards",
),
path(
    "<int:exam_id>/admit-card/release/",
    release_admit_card_api,
    name="release-admit-card",
),
    path(
        "student/results/",
        student_published_results_api,
        name="student-published-results",
    ),
    path(
        "<int:exam_id>/publish/",
        publish_exam_results_api,
        name="publish-exam-results",
    ),
    path(
        "teacher/class/<int:class_id>/section/<int:section_id>/subject/<int:subject_id>/marks/",
        teacher_exam_marks_api,
        name="teacher-exam-marks",
    ),


    
path(
    "<int:exam_id>/schedules/",
    exam_schedules_api,
    name="exam-schedules",
),
path(
    "<int:exam_id>/available-subjects/",
    exam_available_subjects_api,
    name="exam-available-subjects",
),

]