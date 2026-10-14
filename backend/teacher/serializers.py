
from rest_framework import serializers

from .models import TeacherSubjectAllocation
from academics.models import SchoolClass, Section, Subject
from rest_framework import serializers
from .models import TeacherRegistration
from django.contrib.auth import get_user_model
from .models import Teacher

User = get_user_model()

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
        school_class = attrs.get("school_class")
        section = attrs.get("section")
        subject = attrs.get("subject")
        teacher = attrs.get("teacher")

        # Section must belong to selected class
        if section.school_class_id != school_class.id:
            raise serializers.ValidationError({
                "section": "Selected section does not belong to this class."
            })

        # Subject must be assigned to selected class
        if not school_class.class_subjects.filter(
            subject=subject
        ).exists():
            raise serializers.ValidationError({
                "subject": (
                    "This subject is not assigned to the selected class."
                )
            })

        # Prevent duplicate allocation
        if TeacherSubjectAllocation.objects.filter(
            teacher=teacher,
            school_class=school_class,
            section=section,
            subject=subject,
        ).exists():
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