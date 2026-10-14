from decimal import Decimal

from django.db import models


class FeeStructure(models.Model):
    academic_year = models.ForeignKey(
        "academics.AcademicYear",
        on_delete=models.CASCADE,
        related_name="fee_structures",
    )

    school_class = models.ForeignKey(
        "academics.SchoolClass",
        on_delete=models.CASCADE,
        related_name="fee_structures",
    )

    monthly_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    yearly_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    admission_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    exam_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    transport_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    other_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [
            "-academic_year__start_date",
            "school_class__display_order",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=["academic_year", "school_class"],
                name="unique_fee_structure_class_year",
            )
        ]

    def save(self, *args, **kwargs):
        # Monthly fee × 12 = yearly fee
        self.yearly_fee = self.monthly_fee * Decimal("12")

        super().save(*args, **kwargs)

    @property
    def total_annual_fee(self):
        return (
            self.yearly_fee
            + self.admission_fee
            + self.exam_fee
            + self.transport_fee
            + self.other_fee
        )

    def __str__(self):
        return f"{self.school_class.name} - {self.academic_year.name}"

class FeeInvoice(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PARTIAL", "Partially Paid"),
        ("PAID", "Paid"),
        ("CANCELLED", "Cancelled"),
    ]

    student = models.ForeignKey(
        "students.Student",
        on_delete=models.PROTECT,
        related_name="fee_invoices",
    )

    academic_year = models.ForeignKey(
        "academics.AcademicYear",
        on_delete=models.PROTECT,
        related_name="fee_invoices",
    )

    fee_structure = models.ForeignKey(
        FeeStructure,
        on_delete=models.PROTECT,
        related_name="invoices",
    )

    invoice_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
    )

    month = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    year = models.PositiveIntegerField()

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    paid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    due_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    due_date = models.DateField(
        null=True,
        blank=True,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-year", "-month", "-id"]

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            last_invoice = FeeInvoice.objects.order_by("-id").first()

            next_id = (
                last_invoice.id + 1
                if last_invoice
                else 1
            )

            self.invoice_number = f"INV-{next_id:05d}"

        self.due_amount = self.amount - self.paid_amount

        if self.paid_amount <= 0:
            self.status = "PENDING"
        elif self.paid_amount < self.amount:
            self.status = "PARTIAL"
        else:
            self.paid_amount = self.amount
            self.due_amount = 0
            self.status = "PAID"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.student.student_id}"


class FeePayment(models.Model):

    PAYMENT_METHOD_CHOICES = [
        ("ONLINE", "Online"),
        ("CASH", "Cash"),
        ("UPI", "UPI"),
        ("BANK", "Bank Transfer"),
        ("CARD", "Card"),
        ("CHEQUE", "Cheque"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
        ("PENDING", "Pending"),
    ]

    invoice = models.ForeignKey(
        FeeInvoice,
        on_delete=models.PROTECT,
        related_name="payments",
    )

    receipt_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
    )

    transaction_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    payment_date = models.DateField()

    # Accountant ke liye
    # Online payment mein ye NULL rahega
    collected_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="fee_payments_collected",
        null=True,
        blank=True,
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="SUCCESS",
    )

    # Razorpay / Payment Gateway fields
    gateway_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True,
    )

    gateway_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True,
    )

    gateway_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = [
            "-payment_date",
            "-id",
        ]

    def save(self, *args, **kwargs):

        if not self.receipt_number:

            last_receipt = (
                FeePayment.objects
                .order_by("-id")
                .first()
            )

            next_id = (
                last_receipt.id + 1
                if last_receipt
                else 1
            )

            self.receipt_number = (
                f"REC-{next_id:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.receipt_number} - "
            f"₹{self.amount}"
        )


class FeeOnlineOrder(models.Model):

    STATUS_CHOICES = [
        ("CREATED", "Created"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
    ]

    invoice = models.ForeignKey(
        FeeInvoice,
        on_delete=models.PROTECT,
        related_name="online_orders",
    )

    student = models.ForeignKey(
        "students.Student",
        on_delete=models.PROTECT,
        related_name="fee_online_orders",
    )

    # Razorpay order ID
    order_id = models.CharField(
        max_length=100,
        unique=True,
    )

    # Amount in Rupees
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="CREATED",
    )

    # Razorpay payment ID
    payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.order_id} - "
            f"{self.student.student_id}"
        )    