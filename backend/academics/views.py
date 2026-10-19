
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from students.models import Student
from rest_framework import generics


from .permissions import IsSchoolAdminOrSuperAdmin

from .serializers import SubjectSerializer, ClassSubjectSerializer,SectionSerializer,BulkTeacherSubjectAllocationSerializer

from .models import ( AcademicYear, SchoolClass, Section, Subject, ClassSubject, Timetable, )
from .serializers import ( AcademicYearSerializer, SchoolClassSerializer, SectionSerializer, SubjectSerializer, ClassSubjectSerializer, )

from .timetable_serializers import TimetableSerializer
from teacher.models import TeacherSubjectAllocation

class AcademicYearListAPIView(generics.ListAPIView):
     permission_classes = [IsAuthenticated] 
     serializer_class = AcademicYearSerializer 
     def get_queryset(self): 
         return ( AcademicYear.objects .all() .order_by( "-is_active", "-start_date", "name", ) )


class SchoolClassListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SchoolClassSerializer 
    def get_queryset(self): 
        queryset = ( SchoolClass.objects .select_related("academic_year") .all() ) 
        academic_year = self.request.query_params.get( "academic_year" ) 
        if academic_year: queryset = queryset.filter( academic_year_id=academic_year ) 
        return queryset.order_by( "display_order", "name", )


class AdminSectionView(generics.ListCreateAPIView):
    permission_classes = [
        IsAuthenticated,
        IsSchoolAdminOrSuperAdmin,
    ]
    serializer_class = SectionSerializer

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


class MyStudentSubjectsView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            student = Student.objects.select_related(
                "user",
                "academic_year",
                "school_class",
                "section",
            ).get(user=request.user)

        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Student profile not found.",
                },
                status=404,
            )

        
        
        class_subjects = (
            ClassSubject.objects
            .filter(
                school_class=student.school_class,
                subject__is_active=True,
            )
            .select_related("subject")
            .order_by("subject__name")
        )

        allocations = (
            TeacherSubjectAllocation.objects
            .filter(
                school_class=student.school_class,
                section=student.section,
            )
            .select_related("teacher", "subject")
        )

        # Subject ID ke according teacher names group karo
        teacher_map = {}

        for allocation in allocations:
            teacher_name = getattr(
                allocation.teacher,
                "name",
                None,
            ) or str(allocation.teacher)

            teacher_map.setdefault(
                allocation.subject_id, []
            ).append(teacher_name)

        subjects = []

        for item in class_subjects:
            subjects.append({
                "id": item.subject.id,
                "name": item.subject.name,
                "code": item.subject.code,
                "is_optional": item.is_optional,
                "teachers": sorted(
                    set(teacher_map.get(item.subject_id, []))
                ),
            })



class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all().order_by("name")
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

class AdminTimetableListCreateView(
    generics.ListCreateAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = TimetableSerializer

    def get_queryset(self):

        queryset = (
            Timetable.objects
            .select_related(
                "academic_year",
                "school_class",
                "section",
                "subject",
                "teacher",
            )
            .order_by(
                "school_class__display_order",
                "section__name",
                "day",
                "start_time",
            )
        )

        academic_year = self.request.query_params.get(
            "academic_year"
        )

        school_class = self.request.query_params.get(
            "school_class"
        )

        section = self.request.query_params.get(
            "section"
        )

        teacher = self.request.query_params.get(
            "teacher"
        )

        day = self.request.query_params.get(
            "day"
        )

        if academic_year:
            queryset = queryset.filter(
                academic_year_id=academic_year
            )

        if school_class:
            queryset = queryset.filter(
                school_class_id=school_class
            )

        if section:
            queryset = queryset.filter(
                section_id=section
            )

        if teacher:
            queryset = queryset.filter(
                teacher_id=teacher
            )

        if day:
            queryset = queryset.filter(
                day=day
            )

        return queryset

class AdminTimetableDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = TimetableSerializer

    queryset = (
        Timetable.objects
        .select_related(
            "academic_year",
            "school_class",
            "section",
            "subject",
            "teacher",
        )
    )

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

class ClassSubjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ClassSubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            ClassSubject.objects
            .select_related("school_class", "subject")
            .order_by("school_class__display_order", "subject__name")
        )

        school_class = self.request.query_params.get("school_class")

        if school_class:
            queryset = queryset.filter(school_class_id=school_class)

        return queryset    