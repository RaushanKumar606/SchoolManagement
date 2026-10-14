from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):

    list_display = (
        "student_id",
        "first_name",
        "last_name",
        "academic_year",
        "school_class",
        "section",
        "parent_phone",
        "is_active",
        "admission_date",
    )

    list_filter = (
        "academic_year",
        "school_class",
        "section",
        "gender",
        "is_active",
    )

    search_fields = (
        "student_id",
        "first_name",
        "last_name",
        "parent_phone",
        "parent_email",
    )

    readonly_fields = (
        "student_id",
        "admission_date",
        "created_at",
        "updated_at",
    )