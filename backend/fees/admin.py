from django.contrib import admin

from .models import FeeStructure


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "academic_year",
        "school_class",
        "monthly_fee",
        "yearly_fee",
        "admission_fee",
        "exam_fee",
        "transport_fee",
        "other_fee",
        "total_annual_fee_display",
        "is_active",
    )

    list_filter = (
        "academic_year",
        "is_active",
    )

    search_fields = (
        "school_class__name",
        "academic_year__name",
    )

    readonly_fields = (
        "yearly_fee",
        "total_annual_fee_display",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Academic Information",
            {
                "fields": (
                    "academic_year",
                    "school_class",
                    "is_active",
                )
            },
        ),
        (
            "Fee Details",
            {
                "fields": (
                    "monthly_fee",
                    "yearly_fee",
                    "admission_fee",
                    "exam_fee",
                    "transport_fee",
                    "other_fee",
                    "total_annual_fee_display",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(description="Total Annual Fee")
    def total_annual_fee_display(self, obj):
        return obj.total_annual_fee

