
from rest_framework import serializers

from .models import TeacherSubjectAllocation
from academics.models import SchoolClass, Section, Subject
from rest_framework import serializers
from .models import TeacherRegistration
from django.contrib.auth import get_user_model
from .models import Teacher
from .models import Assignment, AssignmentSubmission

User = get_user_model()


from rest_framework import serializers


from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True
    )

    section_name = serializers.CharField(
        source="section.name",
        read_only=True
    )

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True
    )

    teacher_name = serializers.CharField(
        source="teacher.name",
        read_only=True
    )

    assignments_pdf = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "school_class",
            "class_name",
            "section",
            "section_name",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
            "assignments_pdf",
            "due_date",
            "total_marks",
            "created_at",
            "updated_at",
        ]

    def get_assignments_pdf(self, obj):
        request = self.context.get("request")

        if obj.assignments_pdf:
            url = obj.assignments_pdf.url

            if request:
                return request.build_absolute_uri(url)

            return url

        return None

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.student_name",
        read_only=True
    )

    assignment_title = serializers.CharField(
        source="assignment.title",
        read_only=True
    )

    class Meta:
        model = AssignmentSubmission
        fields = [
            "id",
            "assignment",
            "assignment_title",
            "student",
            "student_name",
            "answer_text",
            "file",
            "submitted_at",
            "status",
            "marks",
            "teacher_feedback",
            "reviewed_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "submitted_at",
            "status",
            "marks",
            "teacher_feedback",
            "reviewed_at",
        ]

from rest_framework import serializers
from .models import Assignment


class TeacherRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = TeacherRegistration
        fields = ['name', 'email', 'phone', 'department', 'primary_subject', 'qualification', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        
        # 1. Pehle ek user account create karein (role 'teacher' ke sath)
        user = User.objects.create_user(
            username=validated_data['email'], # Email ko username ki tarah use kar sakte hain
            email=validated_data['email'],
            password=password,
            role='teacher' # Agar aapke User model mein role field hai
        )
        user.is_active = False # Admin approval tak inactive rakhein agar chahein
        user.save()

        # 2. Phir TeacherRegistration table mein data save karke user se link karein
        teacher_profile = TeacherRegistration.objects.create(
            user=user,
            status='Pending', # Default pending
            **validated_data
        )
        return teacher_profile


class TeacherSubjectAllocationSerializer(serializers.ModelSerializer):

    teacher_name = serializers.CharField(
        source="teacher.name",
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

    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True
    )

    class Meta:
        model = TeacherSubjectAllocation
        fields = [
            "id",
            "teacher",
            "teacher_name",
            "school_class",
            "class_name",
            "section",
            "section_name",
            "subject",
            "subject_name",
        ]

    def validate(self, attrs):
        school_class = attrs.get(
            "school_class",
            getattr(self.instance, "school_class", None)
        )

        section = attrs.get(
            "section",
            getattr(self.instance, "section", None)
        )

        subject = attrs.get(
            "subject",
            getattr(self.instance, "subject", None)
        )

        teacher = attrs.get(
            "teacher",
            getattr(self.instance, "teacher", None)
        )

        if not all([school_class, section, subject, teacher]):
            raise serializers.ValidationError(
                "Teacher, class, section and subject are required."
            )

        if section.school_class_id != school_class.id:
            raise serializers.ValidationError({
                "section": "Selected section does not belong to this class."
            })

        if not school_class.class_subjects.filter(
            subject=subject
        ).exists():
            raise serializers.ValidationError({
                "subject": "This subject is not assigned to the selected class."
            })

        duplicate = TeacherSubjectAllocation.objects.filter(
            teacher=teacher,
            school_class=school_class,
            section=section,
            subject=subject,
        )

        if self.instance:
            duplicate = duplicate.exclude(pk=self.instance.pk)

        if duplicate.exists():
            raise serializers.ValidationError({
                "allocation": (
                    "This teacher is already assigned to "
                    "this class, section and subject."
                )
            })

        return attrs


class AdminTeacherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Teacher

        fields = [
            "name",
            "employee_id",
            "email",
            "phone",
            "department",
            "qualification",
            "primary_subject",
        ]

        read_only_fields = [
            "employee_id",
        ]    