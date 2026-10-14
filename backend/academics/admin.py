from django.contrib import admin
from .models import AcademicYear, SchoolClass, Section, Subject, ClassSubject


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "start_date",
        "end_date",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
    )


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "academic_year",
        "display_order",
    )

    list_filter = (
        "academic_year",
    )

    search_fields = (
        "name",
    )


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "school_class",
        "capacity",
    )

    list_filter = (
        "school_class",
    )

    search_fields = (
        "name",
    )


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "code",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "code",
    )


@admin.register(ClassSubject)
class ClassSubjectAdmin(admin.ModelAdmin):

    list_display = (
        "school_class",
        "subject",
        "is_optional",
    )

    list_filter = (
        "school_class",
        "subject",
        "is_optional",
    )