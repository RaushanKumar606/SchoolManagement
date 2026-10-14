from rest_framework import serializers

from .models import AdmissionApplication
from academics.models import AcademicYear, SchoolClass, Section


class ApproveAdmissionSerializer(serializers.Serializer):

    academic_year_id = serializers.IntegerField()
    class_id = serializers.IntegerField()
    section_id = serializers.IntegerField()

    def validate(self, data):

        try:
            academic_year = AcademicYear.objects.get(
                id=data["academic_year_id"]
            )
        except AcademicYear.DoesNotExist:
            raise serializers.ValidationError(
                {"academic_year_id": "Academic year not found."}
            )

        try:
            school_class = SchoolClass.objects.get(
                id=data["class_id"]
            )
        except SchoolClass.DoesNotExist:
            raise serializers.ValidationError(
                {"class_id": "Class not found."}
            )

        try:
            section = Section.objects.get(
                id=data["section_id"]
            )
        except Section.DoesNotExist:
            raise serializers.ValidationError(
                {"section_id": "Section not found."}
            )

        # Make sure Class belongs to selected Academic Year
        if school_class.academic_year_id != academic_year.id:
            raise serializers.ValidationError(
                "Selected class does not belong to selected academic year."
            )

        # Make sure Section belongs to selected Class
        if section.school_class_id != school_class.id:
            raise serializers.ValidationError(
                "Selected section does not belong to selected class."
            )

        data["academic_year"] = academic_year
        data["school_class"] = school_class
        data["section"] = section

        return data