from django.shortcuts import render
from django.utils.dateparse import parse_date, parse_time
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Exam
from .serializers import ExamSerializer


from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from academics.models import SchoolClass, Section, Subject
from students.models import Student
from teacher.models import Teacher, TeacherSubjectAllocation, ExamMark



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Exam,ExamSchedule
from teacher.models import ExamMark


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def exam_list_create_api(request):
    role = str(getattr(request.user, "role", "")).upper()

    if request.method == "GET":
        exams = Exam.objects.select_related(
            "academic_year",
            "school_class",
            "section",
        ).all()

        serializer = ExamSerializer(exams, many=True)
        return Response(serializer.data)

    if role not in {"SCHOOL_ADMIN", "SUPER_ADMIN"}:
        return Response(
            {"error": "Only school admin can create exams."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = ExamSerializer(data=request.data)
    if serializer.is_valid():
        exam = serializer.save()
        return Response(
            ExamSerializer(exam).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def publish_exam_timetable_api(request, exam_id):
    role = str(getattr(request.user, "role", "")).upper()

    if role not in {"SCHOOL_ADMIN", "SUPER_ADMIN"}:
        return Response(
            {"error": "Only School Admin can publish exam timetables."},
            status=status.HTTP_403_FORBIDDEN,
        )

    exam = Exam.objects.filter(id=exam_id).first()

    if not exam:
        return Response(
            {"error": "Exam not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if exam.is_timetable_published:
        return Response(
            {"message": "Exam timetable is already published."},
            status=status.HTTP_200_OK,
        )

    schedules = ExamSchedule.objects.filter(exam=exam)

    if not schedules.exists():
        return Response(
            {"error": "Add at least one exam schedule before publishing."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    exam.is_timetable_published = True
    exam.save(update_fields=["is_timetable_published", "updated_at"])

    return Response(
        {
            "success": True,
            "message": "Exam timetable published successfully.",
            "exam_id": exam.id,
            "exam_name": exam.name,
            "is_timetable_published": True,
        },
        status=status.HTTP_200_OK,
    )



@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def exam_schedules_api(request, exam_id):
    """
    GET: List schedules for an exam.
    POST: Create a subject schedule for an exam.
    """
    role = str(getattr(request.user, "role", "")).upper()

    if role not in {"SCHOOL_ADMIN", "SUPER_ADMIN"}:
        return Response(
            {"error": "Only School Admin can manage exam schedules."},
            status=status.HTTP_403_FORBIDDEN,
        )

    exam = Exam.objects.filter(id=exam_id).first()

    if not exam:
        return Response(
            {"error": "Exam not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        schedules = ExamSchedule.objects.filter(
            exam=exam
        ).select_related("subject")

        data = [
            {
                "id": item.id,
                "subject_id": item.subject_id,
                "subject": item.subject.name,
                "exam_date": item.exam_date.isoformat(),
                "start_time": item.start_time.strftime("%H:%M:%S"),
                "end_time": item.end_time.strftime("%H:%M:%S"),
                "total_marks": item.total_marks,
                "passing_marks": item.passing_marks,
            }
            for item in schedules
        ]

        return Response({"count": len(data), "schedules": data})

    # Do not change schedules after publishing the timetable.
    if exam.is_timetable_published:
        return Response(
            {"error": "Published timetable cannot be changed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    from academics.models import ClassSubject, Subject

    subject_id = request.data.get("subject_id")
    exam_date = parse_date(str(request.data.get("exam_date", "")))
    start_time = parse_time(str(request.data.get("start_time", "")))
    end_time = parse_time(str(request.data.get("end_time", "")))

    if not subject_id or not exam_date or not start_time or not end_time:
        return Response(
            {
                "error": (
                    "subject_id, exam_date, start_time and end_time "
                    "are required. Use YYYY-MM-DD and HH:MM formats."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        subject_id = int(subject_id)
        total_marks = int(request.data.get("total_marks", 100))
        passing_marks = int(request.data.get("passing_marks", 33))
    except (TypeError, ValueError):
        return Response(
            {"error": "Subject ID and marks must be valid numbers."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    subject = Subject.objects.filter(id=subject_id).first()

    if not subject:
        return Response(
            {"error": "Subject not found."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    assigned = ClassSubject.objects.filter(
        school_class_id=exam.school_class_id,
        subject_id=subject_id,
    ).exists()

    if not assigned:
        return Response(
            {"error": "This subject is not assigned to the exam's class."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    schedule = ExamSchedule(
        exam=exam,
        subject=subject,
        exam_date=exam_date,
        start_time=start_time,
        end_time=end_time,
        total_marks=total_marks,
        passing_marks=passing_marks,
    )

    try:
        schedule.full_clean()
        schedule.save()
    except ValidationError as exc:
        return Response(
            {"error": exc.message_dict if hasattr(exc, "message_dict") else exc.messages},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {
            "success": True,
            "message": "Exam schedule created successfully.",
            "schedule": {
                "id": schedule.id,
                "subject_id": schedule.subject_id,
                "subject": schedule.subject.name,
                "exam_date": schedule.exam_date.isoformat(),
                "start_time": schedule.start_time.strftime("%H:%M:%S"),
                "end_time": schedule.end_time.strftime("%H:%M:%S"),
                "total_marks": schedule.total_marks,
                "passing_marks": schedule.passing_marks,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def exam_available_subjects_api(request, exam_id):
    """List subjects already assigned to this exam's class."""
    role = str(getattr(request.user, "role", "")).upper()

    if role not in {"SCHOOL_ADMIN", "SUPER_ADMIN"}:
        return Response(
            {"error": "Only School Admin can view available exam subjects."},
            status=status.HTTP_403_FORBIDDEN,
        )

    exam = Exam.objects.filter(id=exam_id).first()

    if not exam:
        return Response(
            {"error": "Exam not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    from academics.models import ClassSubject

    assigned_subjects = ClassSubject.objects.filter(
        school_class_id=exam.school_class_id
    ).select_related("subject").order_by("subject__name")

    subjects = [
        {
            "id": row.subject_id,
            "name": row.subject.name,
        }
        for row in assigned_subjects
    ]

    return Response({"count": len(subjects), "subjects": subjects})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def release_admit_card_api(request, exam_id):
    role = str(getattr(request.user, "role", "")).upper()

    if role not in {"SCHOOL_ADMIN", "SUPER_ADMIN"}:
        return Response(
            {"error": "Only School Admin can release admit cards."},
            status=status.HTTP_403_FORBIDDEN,
        )

    exam = Exam.objects.filter(id=exam_id).first()

    if not exam:
        return Response(
            {"error": "Exam not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    schedules = ExamSchedule.objects.filter(exam=exam)

    if not schedules.exists():
        return Response(
            {"error": "Add the exam timetable before releasing admit cards."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not exam.is_timetable_published:
        return Response(
            {"error": "Publish the exam timetable before releasing admit cards."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if exam.is_admit_card_released:
        return Response(
            {"message": "Admit cards are already released."},
            status=status.HTTP_200_OK,
        )

    exam.is_admit_card_released = True
    exam.save(update_fields=["is_admit_card_released", "updated_at"])

    return Response(
        {
            "success": True,
            "message": "Admit cards released successfully.",
            "exam_id": exam.id,
            "exam_name": exam.name,
            "is_admit_card_released": True,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_admit_cards_api(request):
    role = str(getattr(request.user, "role", "")).upper()

    if role != "STUDENT":
        return Response(
            {"error": "Only students can access admit cards."},
            status=status.HTTP_403_FORBIDDEN,
        )

    student = Student.objects.filter(
        user=request.user,
        is_active=True,
    ).select_related(
        "academic_year",
        "school_class",
        "section",
    ).first()

    if not student:
        return Response(
            {"error": "Active student profile not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    exams = Exam.objects.filter(
        is_admit_card_released=True,
        academic_year_id=student.academic_year_id,
        school_class_id=student.school_class_id,
        section_id=student.section_id,
    ).select_related(
        "academic_year",
        "school_class",
        "section",
    ).order_by("-start_date")

    admit_cards = []

    for exam in exams:
        schedules = ExamSchedule.objects.filter(
            exam=exam,
        ).select_related("subject").order_by(
            "exam_date",
            "start_time",
        )

        timetable = []

        for schedule in schedules:
            timetable.append({
                "subjectId": schedule.subject_id,
                "subject": schedule.subject.name,
                "examDate": schedule.exam_date,
                "startTime": schedule.start_time,
                "endTime": schedule.end_time,
                "totalMarks": schedule.total_marks,
                "passingMarks": schedule.passing_marks,
            })

        admit_cards.append({
            "examId": exam.id,
            "examName": exam.name,
            "academicYear": exam.academic_year.name,
            "studentId": student.student_id,
            "studentName": " ".join(
                part for part in [
                    student.first_name,
                    getattr(student, "middle_name", ""),
                    student.last_name,
                ] if part
            ),
            "class": exam.school_class.name,
            "section": exam.section.name,
            "startDate": exam.start_date,
            "endDate": exam.end_date,
            "timetable": timetable,
        })

    return Response({
        "count": len(admit_cards),
        "admitCards": admit_cards,
    }, status=status.HTTP_200_OK)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def teacher_exam_marks_api(request, class_id, section_id, subject_id):
    role = str(getattr(request.user, "role", "")).upper()

    if role != "TEACHER":
        return Response(
            {"error": "Only teachers can access this endpoint."},
            status=status.HTTP_403_FORBIDDEN,
        )

    teacher = Teacher.objects.filter(user=request.user).first()

    if not teacher:
        return Response(
            {"error": "Teacher profile not found for logged-in user."},
            status=status.HTTP_403_FORBIDDEN,
        )

    school_class = SchoolClass.objects.filter(id=class_id).first()
    section = Section.objects.filter(
        id=section_id,
        school_class_id=class_id,
    ).first()
    subject = Subject.objects.filter(
        id=subject_id,
        is_active=True,
    ).first()

    if not school_class or not section or not subject:
        return Response(
            {"error": "Invalid class, section, or subject."},
            status=status.HTTP_404_NOT_FOUND,
        )

    assigned = TeacherSubjectAllocation.objects.filter(
        teacher=teacher,
        school_class=school_class,
        section=section,
        subject=subject,
    ).exists()

    if not assigned:
        return Response(
            {"error": "You are not assigned to this class, section and subject."},
            status=status.HTTP_403_FORBIDDEN,
        )

    # GET: exam_id query parameter
    # POST: exam_id request body
    exam_id = request.query_params.get("exam_id")

    if request.method == "POST":
        exam_id = request.data.get("exam_id") or exam_id

    if not exam_id:
        return Response(
            {"error": "exam_id is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    exam = Exam.objects.filter(
        id=exam_id,
        school_class=school_class,
        section=section,
    ).first()

    if not exam:
        return Response(
            {"error": "Exam not found for this class and section."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if exam.is_result_published:
        return Response(
            {"error": "Results are already published. Marks cannot be changed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    students = Student.objects.filter(
        school_class=school_class,
        section=section,
        is_active=True,
    ).order_by("student_id")

    if request.method == "GET":
        marks = ExamMark.objects.filter(
            student__in=students,
            subject=subject,
            exam=exam,
        ).select_related("student")

        marks_by_student = {m.student_id: m for m in marks}

        result = []

        for student in students:
            mark = marks_by_student.get(student.id)

            result.append({
                "studentId": student.id,
                "admissionId": student.student_id,
                "name": " ".join(
                    part for part in [
                        student.first_name,
                        getattr(student, "middle_name", ""),
                        student.last_name,
                    ] if part
                ),
                "marksObtained": mark.marks_obtained if mark else None,
                "totalMarks": mark.total_marks if mark else 100,
                "hasMarks": mark is not None,
                "examMarkId": mark.id if mark else None,
            })

        return Response({
            "examId": exam.id,
            "examName": exam.name,
            "class": school_class.name,
            "section": section.name,
            "subject": subject.name,
            "students": result,
        })

    student_id = request.data.get("student_id")
    marks_obtained = request.data.get("marks_obtained")
    total_marks = request.data.get("total_marks", 100)

    try:
        marks_obtained = float(marks_obtained)
        total_marks = float(total_marks)
    except (TypeError, ValueError):
        return Response(
            {"error": "marks_obtained and total_marks must be numbers."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if total_marks <= 0 or marks_obtained < 0 or marks_obtained > total_marks:
        return Response(
            {"error": "Marks must be between 0 and total_marks, which must be positive."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    student = students.filter(id=student_id).first()

    if not student:
        return Response(
            {"error": "Student not found in this class and section."},
            status=status.HTTP_404_NOT_FOUND,
        )

    with transaction.atomic():
        mark, created = ExamMark.objects.update_or_create(
            student=student,
            subject=subject,
            exam=exam,
            defaults={
                "exam_name": exam.name,
                "marks_obtained": marks_obtained,
                "total_marks": total_marks,
                "teacher": teacher,
            },
        )

    return Response(
        {
            "success": True,
            "message": (
                "Marks saved successfully."
                if created else "Marks updated successfully."
            ),
            "exam_id": exam.id,
            "exam_name": exam.name,
            "student_id": student.id,
            "subject_id": subject.id,
            "marks_obtained": mark.marks_obtained,
            "total_marks": mark.total_marks,
        },
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def publish_exam_results_api(request, exam_id):
    role = str(getattr(request.user, "role", "")).upper()

    if role not in {"SCHOOL_ADMIN", "SUPER_ADMIN"}:
        return Response(
            {"error": "Only School Admin can publish exam results."},
            status=status.HTTP_403_FORBIDDEN,
        )

    exam = Exam.objects.filter(id=exam_id).first()

    if not exam:
        return Response(
            {"error": "Exam not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if exam.is_result_published:
        return Response(
            {"message": "Results are already published."},
            status=status.HTTP_200_OK,
        )

    marks = ExamMark.objects.filter(
        exam=exam,
        student__school_class_id=exam.school_class_id,
        student__section_id=exam.section_id,
        student__academic_year_id=exam.academic_year_id,
    )

    if not marks.exists():
        return Response(
            {"error": "No marks found for this exam. Cannot publish results."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    exam.is_result_published = True
    exam.save(update_fields=["is_result_published", "updated_at"])

    return Response(
        {
            "success": True,
            "message": "Exam results published successfully.",
            "exam_id": exam.id,
            "exam_name": exam.name,
            "is_result_published": exam.is_result_published,
        },
        status=status.HTTP_200_OK,
    )





@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_published_results_api(request):
    role = str(getattr(request.user, "role", "")).upper()

    if role != "STUDENT":
        return Response(
            {"error": "Only students can access their results."},
            status=status.HTTP_403_FORBIDDEN,
        )

    student = Student.objects.filter(user=request.user).first()

    if not student:
        return Response(
            {"error": "Student profile not found for this account."},
            status=status.HTTP_404_NOT_FOUND,
        )

    published_exams = Exam.objects.filter(
        is_result_published=True,
        academic_year_id=student.academic_year_id,
        school_class_id=student.school_class_id,
        section_id=student.section_id,
    ).select_related(
        "academic_year",
        "school_class",
        "section",
    ).order_by("-start_date")

    results = []

    for exam in published_exams:
        marks = ExamMark.objects.filter(
            student=student,
            exam=exam,
        ).select_related("subject").order_by("subject__name")

        subjects = []
        total_obtained = 0.0
        total_possible = 0.0

        for mark in marks:
            obtained = float(mark.marks_obtained)
            possible = float(mark.total_marks)

            total_obtained += obtained
            total_possible += possible

            subjects.append({
                "subject": mark.subject.name,
                "marksObtained": obtained,
                "totalMarks": possible,
                "percentage": round(obtained / possible * 100, 2)
                if possible > 0 else 0,
            })

        percentage = (
            round(total_obtained / total_possible * 100, 2)
            if total_possible > 0 else 0
        )

        results.append({
            "examId": exam.id,
            "examName": exam.name,
            "academicYear": exam.academic_year.name,
            "class": exam.school_class.name,
            "section": exam.section.name,
            "startDate": exam.start_date,
            "endDate": exam.end_date,
            "subjects": subjects,
            "totalObtained": round(total_obtained, 2),
            "totalMarks": round(total_possible, 2),
            "percentage": percentage,
        })

    return Response({
        "studentId": student.student_id,
        "studentName": " ".join(
            part for part in [
                student.first_name,
                getattr(student, "middle_name", ""),
                student.last_name,
            ] if part
        ),
        "results": results,
    }, status=status.HTTP_200_OK)