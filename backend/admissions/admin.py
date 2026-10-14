
# Register your models here.
from django.contrib import admin

from .models import AdmissionApplication


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "application_number",
        "student_first_name",
        "student_last_name",
        "applying_for_class",
        "parent_phone",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "applying_for_class",
        "created_at",
    )

    search_fields = (
        "application_number",
        "student_first_name",
        "student_last_name",
        "parent_phone",
        "parent_email",
    )

    readonly_fields = (
        "application_number",
        "created_at",
        "updated_at",
    )