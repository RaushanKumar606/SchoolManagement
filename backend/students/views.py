from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Student
from .serializers import (
    StudentProfileSerializer,
    StudentSubjectSerializer,
    AdminStudentSerializer,
)

from rest_framework.permissions import IsAuthenticated, BasePermission

from rest_framework.response import Response
from academics.models import ClassSubject
from academics.models import Timetable
from teacher.models import Assignment, AssignmentSubmission,ExamMark,Attendance
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes,
)

class MyStudentProfileView(generics.RetrieveAPIView):

    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Student.objects.select_related(
            "academic_year",
            "school_class",
            "section",
        ).get(user=self.request.user)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard_api(request):
    try:
        student = (
            Student.objects
            .select_related(
                "user",
                "academic_year",
                "school_class",
                "section",
            )
            .filter(
                user=request.user,
                is_active=True,
            )
            .first()
        )

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found.",
                },
                status=404,
            )

        today = timezone.localdate()

        # -------------------------------------------------
        # STUDENT NAME
        # -------------------------------------------------

        student_name = (
            f"{student.first_name} "
            f"{student.middle_name + ' ' if student.middle_name else ''}"
            f"{student.last_name}"
        ).strip()

        # -------------------------------------------------
        # ATTENDANCE
        # -------------------------------------------------

        attendance_records = (
            Attendance.objects
            .filter(student=student)
            .select_related("subject", "teacher")
            .order_by("-date")
        )

        attendance_total = attendance_records.count()
        attendance_present = attendance_records.filter(
            status="Present"
        ).count()

        attendance_absent = attendance_records.filter(
            status="Absent"
        ).count()

        attendance_percentage = (
            round(
                (attendance_present / attendance_total) * 100,
                2,
            )
            if attendance_total > 0
            else 0
        )

        # Subject-wise attendance
        subject_attendance = []

        subject_ids = (
            attendance_records
            .values_list("subject_id", flat=True)
            .distinct()
        )

        for subject_id in subject_ids:

            records = attendance_records.filter(
                subject_id=subject_id
            )

            total = records.count()
            present = records.filter(
                status="Present"
            ).count()

            absent = records.filter(
                status="Absent"
            ).count()

            percentage = (
                round((present / total) * 100, 2)
                if total > 0
                else 0
            )

            subject = records.first().subject

            if subject:
                subject_attendance.append(
                    {
                        "subjectId": subject.id,
                        "subject": subject.name,
                        "subjectCode": subject.code,
                        "total": total,
                        "present": present,
                        "absent": absent,
                        "percentage": percentage,
                    }
                )

        # -------------------------------------------------
        # ASSIGNMENTS
        # -------------------------------------------------

        assignments = (
            Assignment.objects
            .filter(
                school_class=student.school_class,
                section=student.section,
            )
            .select_related(
                "school_class",
                "section",
                "subject",
                "teacher",
            )
            .order_by("-created_at")
        )

        total_assignments = assignments.count()

        submissions = (
            AssignmentSubmission.objects
            .filter(
                student=student,
                assignment__in=assignments,
            )
            .select_related("assignment")
        )

        submission_map = {
            submission.assignment_id: submission
            for submission in submissions
        }

        submitted_count = len(submission_map)

        pending_count = total_assignments - submitted_count

        overdue_count = 0

        recent_assignments = []

        for assignment in assignments[:5]:

            submission = submission_map.get(
                assignment.id
            )

            is_submitted = submission is not None

            is_overdue = (
                assignment.due_date < today
                and not is_submitted
            )

            if is_overdue:
                overdue_count += 1

            recent_assignments.append(
                {
                    "id": assignment.id,
                    "title": assignment.title,
                    "description": assignment.description,

                    "class": {
                        "id": assignment.school_class.id,
                        "name": assignment.school_class.name,
                    },

                    "section": {
                        "id": assignment.section.id,
                        "name": assignment.section.name,
                    },

                    "subject": {
                        "id": assignment.subject.id,
                        "name": assignment.subject.name,
                        "code": assignment.subject.code,
                    },

                    "teacher": {
                        "id": assignment.teacher.id,
                        "name": assignment.teacher.name,
                    },

                    "dueDate": assignment.due_date,
                    "createdAt": assignment.created_at,

                    "submission": {
                        "submitted": is_submitted,
                        "submissionId": (
                            submission.id
                            if submission
                            else None
                        ),
                        "status": (
                            submission.status
                            if submission
                            else "Pending"
                        ),
                        "marks": (
                            submission.marks
                            if submission
                            else None
                        ),
                        "teacherFeedback": (
                            submission.teacher_feedback
                            if submission
                            else None
                        ),
                        "submittedAt": (
                            submission.submitted_at
                            if submission
                            else None
                        ),
                    },

                    "isOverdue": is_overdue,
                }
            )

        # -------------------------------------------------
        # EXAM RESULTS
        # -------------------------------------------------

        exam_marks = (
            ExamMark.objects
            .filter(student=student)
            .select_related(
                "subject",
                "teacher",
            )
            .order_by("-created_at")
        )

        total_exam_marks = exam_marks.count()

        total_obtained = sum(
            float(mark.marks_obtained)
            for mark in exam_marks
        )

        total_possible = sum(
            float(mark.total_marks)
            for mark in exam_marks
        )

        overall_percentage = (
            round(
                (total_obtained / total_possible) * 100,
                2,
            )
            if total_possible > 0
            else 0
        )

        total_exams = (
            exam_marks
            .values("exam_name")
            .distinct()
            .count()
        )

        total_subjects = (
            exam_marks
            .values("subject")
            .distinct()
            .count()
        )

        recent_results = []

        for mark in exam_marks[:5]:

            percentage = (
                round(
                    (
                        float(mark.marks_obtained)
                        / float(mark.total_marks)
                    ) * 100,
                    2,
                )
                if mark.total_marks > 0
                else 0
            )

            recent_results.append(
                {
                    "id": mark.id,
                    "examName": mark.exam_name,

                    "subject": {
                        "id": mark.subject.id,
                        "name": mark.subject.name,
                        "code": mark.subject.code,
                    },

                    "marksObtained": mark.marks_obtained,
                    "totalMarks": mark.total_marks,
                    "percentage": percentage,

                    "teacher": (
                        mark.teacher.name
                        if mark.teacher
                        else None
                    ),

                    "createdAt": mark.created_at,
                }
            )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return Response(
            {
                "success": True,

                "student": {
                    "id": student.id,
                    "studentId": student.student_id,
                    "name": student_name,
                    "email": (
                        student.user.email
                        if student.user
                        else ""
                    ),
                    "gender": student.gender,
                    "dateOfBirth": student.date_of_birth,
                },

                "academic": {
                    "academicYear": {
                        "id": student.academic_year.id,
                        "name": student.academic_year.name,
                    },

                    "class": {
                        "id": student.school_class.id,
                        "name": student.school_class.name,
                    },

                    "section": {
                        "id": student.section.id,
                        "name": student.section.name,
                    },
                },

                "attendance": {
                    "total": attendance_total,
                    "present": attendance_present,
                    "absent": attendance_absent,
                    "percentage": attendance_percentage,
                    "subjects": subject_attendance,
                },

                "assignments": {
                    "total": total_assignments,
                    "submitted": submitted_count,
                    "pending": pending_count,
                    "overdue": overdue_count,
                    "recent": recent_assignments,
                },

                "results": {
                    "totalMarks": total_exam_marks,
                    "totalExams": total_exams,
                    "totalSubjects": total_subjects,
                    "totalObtained": total_obtained,
                    "totalPossible": total_possible,
                    "overallPercentage": overall_percentage,
                    "recent": recent_results,
                },

                "date": today,
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_student_assignments_api(request):
    try:
        # -----------------------------------
        # Get logged-in student's profile
        # -----------------------------------
        student = (
            Student.objects
            .select_related(
                "user",
                "academic_year",
                "school_class",
                "section",
            )
            .filter(user=request.user)
            .first()
        )

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found."
                },
                status=404
            )

        # -----------------------------------
        # Get assignments for student's
        # exact class + section
        # -----------------------------------
        assignments = (
            Assignment.objects
            .filter(
                school_class=student.school_class,
                section=student.section,
            )
            .select_related(
                "teacher",
                "school_class",
                "section",
                "subject",
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

                    "teacherId": assignment.teacher.id,
                    "teacher": assignment.teacher.name,

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

                "student": {
                    "studentId": student.student_id,
                    "name": (
                        f"{student.first_name} "
                        f"{student.middle_name + ' ' if student.middle_name else ''}"
                        f"{student.last_name}"
                    ).strip(),
                },

                "academicYear": student.academic_year.name,

                "class": {
                    "id": student.school_class.id,
                    "name": student.school_class.name,
                },

                "section": {
                    "id": student.section.id,
                    "name": student.section.name,
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def submit_assignment_api(request, assignment_id):
    try:
        # -----------------------------------
        # Get logged-in student
        # -----------------------------------
        student = (
            Student.objects
            .select_related(
                "academic_year",
                "school_class",
                "section",
            )
            .filter(user=request.user)
            .first()
        )

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found."
                },
                status=404
            )

        # -----------------------------------
        # Get assignment
        # -----------------------------------
        assignment = (
            Assignment.objects
            .select_related(
                "school_class",
                "section",
                "subject",
                "teacher",
            )
            .filter(id=assignment_id)
            .first()
        )

        if not assignment:
            return Response(
                {
                    "success": False,
                    "error": "Assignment not found."
                },
                status=404
            )

        # -----------------------------------
        # Check student's class + section
        # -----------------------------------
        if (
            assignment.school_class_id != student.school_class_id
            or assignment.section_id != student.section_id
        ):
            return Response(
                {
                    "success": False,
                    "error": (
                        "Access denied. This assignment "
                        "is not assigned to your class and section."
                    )
                },
                status=403
            )

        # -----------------------------------
        # Get submission data
        # -----------------------------------
        answer_text = request.data.get("answer_text", "")
        uploaded_file = request.FILES.get("file")

        if not answer_text and not uploaded_file:
            return Response(
                {
                    "success": False,
                    "error": (
                        "Please provide an answer or upload "
                        "a submission file."
                    )
                },
                status=400
            )

        # -----------------------------------
        # Check existing submission
        # -----------------------------------
        submission = AssignmentSubmission.objects.filter(
            assignment=assignment,
            student=student,
        ).first()

        # -----------------------------------
        # Create submission
        # -----------------------------------
        if not submission:
            submission = AssignmentSubmission.objects.create(
                assignment=assignment,
                student=student,
                answer_text=answer_text,
                file=uploaded_file,
                status="Submitted",
            )

            message = "Assignment submitted successfully."

        # -----------------------------------
        # Update existing submission
        # -----------------------------------
        else:
            submission.answer_text = answer_text

            if uploaded_file:
                submission.file = uploaded_file

            submission.status = "Submitted"
            submission.teacher_feedback = None
            submission.marks = None
            submission.reviewed_at = None

            submission.save()

            message = "Assignment resubmitted successfully."

        # -----------------------------------
        # Response
        # -----------------------------------
        return Response(
            {
                "success": True,
                "message": message,
                "data": {
                    "submissionId": submission.id,

                    "assignmentId": assignment.id,
                    "assignmentTitle": assignment.title,

                    "studentId": student.student_id,

                    "subjectId": assignment.subject.id,
                    "subject": assignment.subject.name,

                    "status": submission.status,

                    "answerText": submission.answer_text,

                    "file": (
                        request.build_absolute_uri(
                            submission.file.url
                        )
                        if submission.file
                        else None
                    ),

                    "submittedAt": submission.submitted_at,

                    "marks": submission.marks,

                    "teacherFeedback": submission.teacher_feedback,
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_exam_results_api(request):
    try:
        # --------------------------------
        # Get logged-in student's profile
        # --------------------------------

        student = Student.objects.select_related(
            "academic_year",
            "school_class",
            "section"
        ).filter(
            user=request.user,
            is_active=True
        ).first()

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found."
                },
                status=404
            )

        # --------------------------------
        # Get Exam Marks
        # --------------------------------

        exam_marks = ExamMark.objects.filter(
            student=student
        ).select_related(
            "subject",
            "teacher"
        ).order_by(
            "-exam_name",
            "subject__name"
        )

        results = []

        for mark in exam_marks:

            percentage = 0

            if mark.total_marks > 0:
                percentage = round(
                    (mark.marks_obtained / mark.total_marks) * 100,
                    2
                )

            results.append(
                {
                    "id": mark.id,

                    "examName": mark.exam_name,

                    "subject": {
                        "id": mark.subject.id,
                        "name": mark.subject.name,
                        "code": mark.subject.code
                    },

                    "marksObtained": mark.marks_obtained,

                    "totalMarks": mark.total_marks,

                    "percentage": percentage,

                    "teacher": (
                        mark.teacher.name
                        if mark.teacher
                        else None
                    ),

                    "createdAt": mark.created_at,
                    "updatedAt": mark.updated_at
                }
            )

        # --------------------------------
        # Calculate Overall Statistics
        # --------------------------------

        total_obtained = sum(
            float(mark.marks_obtained)
            for mark in exam_marks
        )

        total_possible = sum(
            float(mark.total_marks)
            for mark in exam_marks
        )

        overall_percentage = 0

        if total_possible > 0:
            overall_percentage = round(
                (total_obtained / total_possible) * 100,
                2
            )

        # --------------------------------
        # Response
        # --------------------------------

        return Response(
            {
                "success": True,

                "student": {
                    "id": student.id,
                    "studentId": student.student_id,
                    "name": (
                        f"{student.first_name} "
                        f"{student.middle_name + ' ' if student.middle_name else ''}"
                        f"{student.last_name}"
                    ).strip()
                },

                "academicYear": {
                    "id": student.academic_year.id,
                    "name": student.academic_year.name
                },

                "class": {
                    "id": student.school_class.id,
                    "name": student.school_class.name
                },

                "section": {
                    "id": student.section.id,
                    "name": student.section.name
                },

                "statistics": {
                    "totalSubjects": exam_marks.values(
                        "subject"
                    ).distinct().count(),

                    "totalExams": exam_marks.values(
                        "exam_name"
                    ).distinct().count(),

                    "totalObtained": total_obtained,

                    "totalPossible": total_possible,

                    "overallPercentage": overall_percentage
                },

                "count": len(results),

                "results": results
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
def my_exam_result_detail_api(request, exam_name):
    try:
        # --------------------------------
        # Get logged-in student
        # --------------------------------

        student = Student.objects.select_related(
            "academic_year",
            "school_class",
            "section"
        ).filter(
            user=request.user,
            is_active=True
        ).first()

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found."
                },
                status=404
            )

        # --------------------------------
        # Get student's marks
        # --------------------------------

        exam_marks = ExamMark.objects.filter(
            student=student,
            exam_name=exam_name
        ).select_related(
            "subject",
            "teacher"
        ).order_by(
            "subject__name"
        )

        if not exam_marks.exists():
            return Response(
                {
                    "success": False,
                    "error": "No result found for this exam."
                },
                status=404
            )

        # --------------------------------
        # Build subject results
        # --------------------------------

        subjects = []

        total_obtained = 0
        total_marks = 0

        for mark in exam_marks:

            obtained = float(mark.marks_obtained)
            maximum = float(mark.total_marks)

            percentage = 0

            if maximum > 0:
                percentage = round(
                    (obtained / maximum) * 100,
                    2
                )

            total_obtained += obtained
            total_marks += maximum

            subjects.append(
                {
                    "id": mark.id,

                    "subject": {
                        "id": mark.subject.id,
                        "name": mark.subject.name,
                        "code": mark.subject.code
                    },

                    "marksObtained": obtained,

                    "totalMarks": maximum,

                    "percentage": percentage,

                    "teacher": (
                        mark.teacher.name
                        if mark.teacher
                        else None
                    )
                }
            )

        # --------------------------------
        # Overall percentage
        # --------------------------------

        overall_percentage = 0

        if total_marks > 0:
            overall_percentage = round(
                (total_obtained / total_marks) * 100,
                2
            )

        # --------------------------------
        # Determine result status
        # --------------------------------

        result_status = "Pass"

        for subject in subjects:
            if subject["percentage"] < 33:
                result_status = "Fail"
                break

        # --------------------------------
        # Response
        # --------------------------------

        return Response(
            {
                "success": True,

                "student": {
                    "id": student.id,
                    "studentId": student.student_id,
                    "name": (
                        f"{student.first_name} "
                        f"{student.middle_name + ' ' if student.middle_name else ''}"
                        f"{student.last_name}"
                    ).strip()
                },

                "academicYear": {
                    "id": student.academic_year.id,
                    "name": student.academic_year.name
                },

                "class": {
                    "id": student.school_class.id,
                    "name": student.school_class.name
                },

                "section": {
                    "id": student.section.id,
                    "name": student.section.name
                },

                "exam": {
                    "name": exam_name
                },

                "summary": {
                    "totalSubjects": len(subjects),
                    "totalObtained": total_obtained,
                    "totalMarks": total_marks,
                    "percentage": overall_percentage,
                    "status": result_status
                },

                "subjects": subjects
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
def my_attendance_summary_api(request):
    try:
        student = Student.objects.select_related(
            "academic_year",
            "school_class",
            "section"
        ).filter(
            user=request.user,
            is_active=True
        ).first()

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found."
                },
                status=404
            )

        attendance_records = Attendance.objects.filter(
            student=student
        ).select_related(
            "subject",
            "teacher"
        ).order_by("-date")

        total = attendance_records.count()

        present = attendance_records.filter(
            status="Present"
        ).count()

        absent = attendance_records.filter(
            status="Absent"
        ).count()

        percentage = 0

        if total > 0:
            percentage = round(
                (present / total) * 100,
                2
            )

        # --------------------------------
        # Subject-wise summary
        # --------------------------------

        subjects = []

        subject_ids = attendance_records.values_list(
            "subject_id",
            flat=True
        ).distinct()

        for subject_id in subject_ids:

            subject_records = attendance_records.filter(
                subject_id=subject_id
            )

            subject_total = subject_records.count()

            subject_present = subject_records.filter(
                status="Present"
            ).count()

            subject_absent = subject_records.filter(
                status="Absent"
            ).count()

            subject_percentage = 0

            if subject_total > 0:
                subject_percentage = round(
                    (subject_present / subject_total) * 100,
                    2
                )

            subject = subject_records.first().subject

            subjects.append(
                {
                    "subjectId": subject.id,
                    "subject": subject.name,
                    "subjectCode": subject.code,
                    "total": subject_total,
                    "present": subject_present,
                    "absent": subject_absent,
                    "percentage": subject_percentage
                }
            )

        # --------------------------------
        # Recent attendance
        # --------------------------------

        recent_records = []

        for attendance in attendance_records[:30]:

            recent_records.append(
                {
                    "id": attendance.id,
                    "date": attendance.date,
                    "status": attendance.status,

                    "subject": {
                        "id": attendance.subject.id,
                        "name": attendance.subject.name,
                        "code": attendance.subject.code
                    },

                    "teacher": (
                        attendance.teacher.name
                        if attendance.teacher
                        else None
                    )
                }
            )

        return Response(
            {
                "success": True,

                "student": {
                    "id": student.id,
                    "studentId": student.student_id,
                    "name": (
                        f"{student.first_name} "
                        f"{student.middle_name + ' ' if student.middle_name else ''}"
                        f"{student.last_name}"
                    ).strip()
                },

                "class": {
                    "id": student.school_class.id,
                    "name": student.school_class.name
                },

                "section": {
                    "id": student.section.id,
                    "name": student.section.name
                },

                "summary": {
                    "total": total,
                    "present": present,
                    "absent": absent,
                    "percentage": percentage
                },

                "subjects": subjects,

                "recent": recent_records
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
def my_student_timetable_api(request):

    try:

        student = (
            Student.objects
            .select_related(
                "academic_year",
                "school_class",
                "section",
            )
            .filter(
                user=request.user,
                is_active=True,
            )
            .first()
        )

        if not student:
            return Response(
                {
                    "success": False,
                    "error": "Student profile not found.",
                },
                status=404,
            )

        day = request.query_params.get(
            "day"
        )

        timetable_query = (
            Timetable.objects
            .filter(
                academic_year=student.academic_year,
                school_class=student.school_class,
                section=student.section,
                is_active=True,
            )
            .select_related(
                "subject",
                "teacher",
                "school_class",
                "section",
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

                    "subject": {
                        "id": item.subject.id,
                        "name": item.subject.name,
                        "code": item.subject.code,
                    },

                    "teacher": (
                        {
                            "id": item.teacher.id,
                            "name": item.teacher.name,
                            "employeeId": item.teacher.employee_id,
                        }
                        if item.teacher
                        else None
                    ),
                }
            )

        return Response(
            {
                "success": True,

                "student": {
                    "studentId": student.student_id,
                    "name": (
                        f"{student.first_name} "
                        f"{student.middle_name + ' ' if student.middle_name else ''}"
                        f"{student.last_name}"
                    ).strip(),
                },

                "academicYear": {
                    "id": student.academic_year.id,
                    "name": student.academic_year.name,
                },

                "class": {
                    "id": student.school_class.id,
                    "name": student.school_class.name,
                },

                "section": {
                    "id": student.section.id,
                    "name": student.section.name,
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


class AdminStudentListView(generics.ListAPIView):
    serializer_class = AdminStudentSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        queryset = (
            Student.objects
            .select_related(
                "user",
                "academic_year",
                "school_class",
                "section",
            )
            .order_by(
                "school_class__name",
                "section__name",
                "student_id",
            )
        )

        # ==============================
        # CLASS FILTER
        # ==============================

        school_class = self.request.query_params.get(
            "school_class"
        )

        if school_class:
            queryset = queryset.filter(
                school_class_id=school_class
            )

        # ==============================
        # SECTION FILTER
        # ==============================

        section = self.request.query_params.get(
            "section"
        )

        if section:
            queryset = queryset.filter(
                section_id=section
            )

        # ==============================
        # SEARCH
        # ==============================

        search = self.request.query_params.get(
            "search"
        )

        if search:
            queryset = queryset.filter(
                models.Q(
                    first_name__icontains=search
                )
                | models.Q(
                    middle_name__icontains=search
                )
                | models.Q(
                    last_name__icontains=search
                )
                | models.Q(
                    student_id__icontains=search
                )
                | models.Q(
                    parent_phone__icontains=search
                )
            )

        # ==============================
        # ACTIVE / INACTIVE FILTER
        # ==============================

        is_active = self.request.query_params.get(
            "is_active"
        )

        if is_active is not None:
            queryset = queryset.filter(
                is_active=is_active.lower() == "true"
            )

        return queryset
class IsSchoolAdminOrSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in [
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
            ]
        )

class AdminStudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.select_related(
        "user",
        "academic_year",
        "school_class",
        "section",
    )
    serializer_class = AdminStudentSerializer

    permission_classes = [
        IsAuthenticated,
        IsSchoolAdminOrSuperAdmin,
    ]

    lookup_field = "pk"

    def perform_destroy(self, instance):
        """
        Student delete hone par linked login account ko
        permanently delete nahi karenge.
        Us account ko inactive kar denge.
        """

        if instance.user:
            instance.user.is_active = False
            instance.user.save(update_fields=["is_active"])

        instance.delete()


class MyStudentSubjectsView(generics.ListAPIView):

    serializer_class = StudentSubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        student = Student.objects.select_related(
            "school_class"
        ).get(
            user=self.request.user
        )

        return (
            ClassSubject.objects
            .filter(
                school_class=student.school_class,
                subject__is_active=True,
            )
            .select_related("subject")
            .order_by("subject__name")
        )