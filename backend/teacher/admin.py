from django.contrib import admin
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.shortcuts import render
from django.http import HttpResponseRedirect
import random
from .models import (
    TeacherRegistration, Teacher, TeacherSubjectAllocation, 
    Student, Attendance, ExamMark, Assignment, LeaveRequest
)

User = get_user_model()

class TeacherSubjectAllocationInline(admin.TabularInline):
    model = TeacherSubjectAllocation
    extra = 1

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('name', 'employee_id', 'department', 'primary_subject')
    search_fields = ('name', 'employee_id')
    inlines = [TeacherSubjectAllocationInline]




@admin.register(TeacherRegistration)
class TeacherRegistrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'department', 'primary_subject', 'status', 'employee_id')
    list_filter = ('status', 'department')
    actions = ['approve_with_class_allocation']

    @admin.action(description='Approve and Assign Class/Subject')
    def approve_with_class_allocation(self, request, queryset):
        if 'apply' in request.POST:
            class_name = request.POST.get('class_name')
            section = request.POST.get('section')
            subject = request.POST.get('subject')

            for reg in queryset:
                if reg.status != 'Approved':
                    # 1. Unique Employee ID aur Password generate karein
                    emp_id = f"TCH-2026-{random.randint(1000, 9999)}"
                    while Teacher.objects.filter(employee_id=emp_id).exists():
                        emp_id = f"TCH-2026-{random.randint(1000, 9999)}"

                    temp_password = f"Pass@{random.randint(100, 999)}"

                    # 2. Django User create karein (Username = Employee ID)
                    user = User.objects.create_user(username=emp_id, password=temp_password)
                    reg.user = user
                    reg.employee_id = emp_id
                    reg.status = 'Approved'
                    reg.save()

                    # 3. Main Teacher table mein entry banayein
                    teacher_profile = Teacher.objects.create(
                        user=user,
                        name=reg.name,
                        employee_id=emp_id,
                        department=reg.department,
                        primary_subject=reg.primary_subject
                    )

                    # 4. Class aur Subject allocate karein
                    TeacherSubjectAllocation.objects.create(
                        teacher=teacher_profile,
                        class_name=class_name,
                        section=section,
                        subject=subject
                    )

                    # 5. Email bhejne ka code (Console par print hoga agar backend console hai)
                    try:
                        send_mail(
                            subject='Your Teacher Portal Credentials & Class Assignment',
                            message=f"Hello {reg.name},\n\nYour registration has been approved!\n\n"
                                    f"Assigned Class: Class {class_name} - Section {section}\n"
                                    f"Assigned Subject: {subject}\n\n"
                                    f"Your Login Credentials:\n"
                                    f"Employee ID: {emp_id}\n"
                                    f"Password: {temp_password}\n\n"
                                    f"Please login to the portal.",
                            from_email='admin@schoolsystem.com',
                            recipient_list=[reg.email],
                            fail_silently=False,
                        )
                    except Exception as e:
                        print(f"Email error: {e}")

            self.message_user(request, "Teachers approved and classes assigned successfully!")
            return HttpResponseRedirect(request.get_full_path())

        return render(request, 'admin/teacher_approval_form.html', {'teachers': queryset})


# Baaki models ko bhi register kar dein
admin.site.register(Student)
admin.site.register(Attendance)
admin.site.register(ExamMark)
admin.site.register(Assignment)
admin.site.register(LeaveRequest)