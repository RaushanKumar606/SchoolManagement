from decimal import Decimal

from django.conf import settings
from django.db import models


# =========================================================
# SALARY STRUCTURE
# =========================================================

class SalaryStructure(models.Model):
    """
    Employee ki fixed salary structure.

    Teacher, School Admin, Accountant aur
    other staff sabke liye use ho sakta hai.
    """

    EMPLOYEE_TYPE_CHOICES = [
        ("TEACHER", "Teacher"),
        ("SCHOOL_ADMIN", "School Admin"),
        ("ACCOUNTANT", "Accountant"),
        ("STAFF", "Other Staff"),
    ]

    employee_type = models.CharField(
        max_length=20,
        choices=EMPLOYEE_TYPE_CHOICES,
    )

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="salary_structures",
    )

    basic_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    house_rent_allowance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    transport_allowance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    other_allowance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    other_deduction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    effective_from = models.DateField()

    effective_to = models.DateField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # =====================================================
    # CALCULATIONS
    # =====================================================

    @property
    def total_allowance(self):
        return (
            self.house_rent_allowance
            + self.transport_allowance
            + self.other_allowance
        )

    @property
    def net_salary(self):
        return (
            self.basic_salary
            + self.total_allowance
            - self.other_deduction
        )

    def __str__(self):
        return (
            f"{self.employee.username} - "
            f"{self.employee_type}"
        )




class EmployeeBankDetails(models.Model):
    employee = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bank_details",
    )

    account_holder_name = models.CharField(
        max_length=150
    )

    account_number = models.CharField(
        max_length=50
    )

    ifsc_code = models.CharField(
        max_length=20
    )

    bank_name = models.CharField(
        max_length=150
    )

    branch_name = models.CharField(
        max_length=150,
        blank=True,
        null=True,
    )

    is_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.employee.username} - "
            f"{self.bank_name}"
        )
# =========================================================
# SALARY SLIP
# =========================================================

class SalarySlip(models.Model):
    """
    Har employee ki monthly salary record/slip.

    Flow:
    DRAFT → APPROVED → PAID
    """

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("APPROVED", "Approved"),
        ("PAID", "Paid"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("BANK", "Bank Transfer"),
        ("UPI", "UPI"),
        ("CASH", "Cash"),
        ("CHEQUE", "Cheque"),
    ]

    # =====================================================
    # EMPLOYEE
    # =====================================================

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="salary_slips",
    )

    salary_structure = models.ForeignKey(
        SalaryStructure,
        on_delete=models.PROTECT,
        related_name="salary_slips",
    )

    # =====================================================
    # SALARY PERIOD
    # =====================================================

    month = models.PositiveIntegerField()

    year = models.PositiveIntegerField()

    # =====================================================
    # SALARY DETAILS
    # =====================================================

    basic_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    total_allowance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    total_deduction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    net_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    # =====================================================
    # SALARY STATUS
    # =====================================================

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT",
    )

    # =====================================================
    # PAYMENT DETAILS
    # =====================================================

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        null=True,
        blank=True,
    )

    payment_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    paid_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="salary_payments_processed",
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    # =====================================================
    # REMARKS
    # =====================================================

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # =====================================================
    # META
    # =====================================================

    class Meta:
        ordering = [
            "-year",
            "-month",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "employee",
                    "month",
                    "year",
                ],
                name="unique_employee_month_year_salary",
            )
        ]

    # =====================================================
    # STRING
    # =====================================================

    def __str__(self):
        return (
            f"{self.employee.username} - "
            f"{self.month}/{self.year}"
        )
    """
    Har employee ki monthly salary record/slip.
    """

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("APPROVED", "Approved"),
        ("PAID", "Paid"),
    ]

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="salary_slips",
    )

    salary_structure = models.ForeignKey(
        SalaryStructure,
        on_delete=models.PROTECT,
        related_name="salary_slips",
    )

    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    basic_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    total_allowance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    total_deduction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    net_salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT",
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    payment_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-month"]
        constraints = [
            models.UniqueConstraint(
                fields=["employee", "month", "year"],
                name="unique_employee_month_year_salary",
            )
        ]

    def __str__(self):
        return f"{self.employee.username} - {self.month}/{self.year}"