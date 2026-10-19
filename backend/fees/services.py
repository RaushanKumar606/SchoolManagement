
import calendar
from datetime import date
from decimal import Decimal

from django.db import transaction

from students.models import Student
from .models import FeeStructure, FeeInvoice


@transaction.atomic
def generate_monthly_fee_invoices(month, year):
    """
    Active students ke liye monthly fee invoices generate karta hai.
    Existing invoice ko dobara create nahi karta.
    """

    if month < 1 or month > 12:
        raise ValueError("Month must be between 1 and 12.")

    due_day = min(10, calendar.monthrange(year, month)[1])
    due_date = date(year, month, due_day)

    students = (
        Student.objects
        .filter(
            is_active=True,
            academic_year__isnull=False,
            school_class__isnull=False,
        )
        .select_related(
            "academic_year",
            "school_class",
        )
    )

    created_count = 0
    skipped_count = 0
    errors = []

    for student in students:
        fee_structure = FeeStructure.objects.filter(
            academic_year_id=student.academic_year_id,
            school_class_id=student.school_class_id,
            is_active=True,
        ).first()

        if not fee_structure:
            skipped_count += 1
            errors.append({
                "student_id": student.student_id,
                "reason": "Active fee structure not found.",
            })
            continue

        amount = Decimal(str(fee_structure.monthly_fee))

        if amount <= Decimal("0.00"):
            skipped_count += 1
            errors.append({
                "student_id": student.student_id,
                "reason": "Monthly fee must be greater than zero.",
            })
            continue

        _, created = FeeInvoice.objects.get_or_create(
            student=student,
            month=month,
            year=year,
            defaults={
                "academic_year": student.academic_year,
                "fee_structure": fee_structure,
                "amount": amount,
                "paid_amount": Decimal("0.00"),
                "due_date": due_date,
                "remarks": f"Monthly fee invoice for {month:02d}/{year}",
            },
        )

        if created:
            created_count += 1
        else:
            skipped_count += 1

    return {
        "month": month,
        "year": year,
        "created": created_count,
        "skipped": skipped_count,
        "errors": errors,
    }
