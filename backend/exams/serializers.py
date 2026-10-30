
from rest_framework import serializers
from .models import Exam
from rest_framework import serializers
from teacher.models import ExamMark



class ExamSerializer(serializers.ModelSerializer):
    academic_year_name = serializers.CharField(
        source="academic_year.name",
        read_only=True
    )
    
    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True
    )
    
    section_name = serializers.CharField(
        source="section.name",
        read_only=True
    )
    class Meta:
        model = Exam
        fields = [
            "id",
            "name",
            "academic_year_name",
            "class_name",
            "section_name",
            "school_class",
            "section",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
            "is_admit_card_released",
            "is_timetable_published",
            "is_result_published",
            
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "is_admit_card_released",
            "is_timetable_published",
            "is_result_published",
        ]

    def validate(self, attrs):
        academic_year = attrs.get(
            "academic_year",
            getattr(self.instance, "academic_year", None),
        )
        school_class = attrs.get(
            "school_class",
            getattr(self.instance, "school_class", None),
        )
        section = attrs.get(
            "section",
            getattr(self.instance, "section", None),
        )
        start_date = attrs.get(
            "start_date",
            getattr(self.instance, "start_date", None),
        )
        end_date = attrs.get(
            "end_date",
            getattr(self.instance, "end_date", None),
        )

        if (
            academic_year
            and school_class
            and school_class.academic_year_id != academic_year.id
        ):
            raise serializers.ValidationError({
                "school_class": "Selected class does not belong to this academic year."
            })

        if (
            section
            and school_class
            and section.school_class_id != school_class.id
        ):
            raise serializers.ValidationError({
                "section": "Selected section does not belong to this class."
            })

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be before start date."
            })

        return attrs
    
    

class ExamMarkSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = ExamMark
        fields = [
            "id",
            "student",
            "student_name",
            "subject",
            "exam_name",
            "marks_obtained",
            "total_marks",
            "teacher",
        ]
        read_only_fields = ["id", "teacher"]

    def get_student_name(self, obj):
        student = obj.student
        return " ".join(
            part for part in [
                student.first_name,
                getattr(student, "middle_name", ""),
                student.last_name,
            ]
            if part
        )

    def validate(self, attrs):
        marks = attrs.get(
            "marks_obtained",
            getattr(self.instance, "marks_obtained", None),
        )
        total = attrs.get(
            "total_marks",
            getattr(self.instance, "total_marks", 100),
        )

        if total is None or total <= 0:
            raise serializers.ValidationError({
                "total_marks": "Total marks must be greater than zero."
            })

        if marks is not None and (marks < 0 or marks > total):
            raise serializers.ValidationError({
                "marks_obtained": "Marks must be between zero and total marks."
            })

        return attrs
