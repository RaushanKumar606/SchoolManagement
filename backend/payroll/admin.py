from django.contrib import admin

from .models import SalaryStructure, SalarySlip


@admin.register(SalaryStructure)
class SalaryStructureAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "employee",
        "employee_type",
        "basic_salary",
        "total_allowance_display",
        "net_salary_display",
        "effective_from",
        "is_active",
    )

    list_filter = (
        "employee_type",
        "is_active",
        "effective_from",
    )

    search_fields = (
        "employee__username",
        "employee__first_name",
        "employee__last_name",
        "employee__email",
    )

    readonly_fields = (
        "total_allowance_display",
        "net_salary_display",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Employee",
            {
                "fields": (
                    "employee",
                    "employee_type",
                )
            },
        ),
        (
            "Salary",
            {
                "fields": (
                    "basic_salary",
                    "house_rent_allowance",
                    "transport_allowance",
                    "other_allowance",
                    "other_deduction",
                    "total_allowance_display",
                    "net_salary_display",
                )
            },
        ),
        (
            "Validity",
            {
                "fields": (
                    "effective_from",
                    "effective_to",
                    "is_active",
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

    @admin.display(description="Total Allowance")
    def total_allowance_display(self, obj):
        return obj.total_allowance

    @admin.display(description="Net Salary")
    def net_salary_display(self, obj):
        return obj.net_salary


@admin.register(SalarySlip)
class SalarySlipAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "employee",
        "employee_type_display",
        "month",
        "year",
        "basic_salary",
        "total_allowance",
        "total_deduction",
        "net_salary",
        "status",
        "paid_at",
    )

    list_filter = (
        "status",
        "month",
        "year",
    )

    search_fields = (
        "employee__username",
        "employee__first_name",
        "employee__last_name",
        "employee__email",
        "payment_reference",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "paid_at",
    )

    fieldsets = (
        (
            "Employee",
            {
                "fields": (
                    "employee",
                    "salary_structure",
                )
            },
        ),
        (
            "Salary Period",
            {
                "fields": (
                    "month",
                    "year",
                )
            },
        ),
        (
            "Salary Details",
            {
                "fields": (
                    "basic_salary",
                    "total_allowance",
                    "total_deduction",
                    "net_salary",
                )
            },
        ),
        (
            "Payment",
            {
                "fields": (
                    "status",
                    "paid_at",
                    "payment_reference",
                    "remarks",
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

    @admin.display(description="Employee Type")
    def employee_type_display(self, obj):
        return obj.salary_structure.employee_type