
from datetime import date

from django.core.management.base import BaseCommand, CommandError

from fees.services import generate_monthly_fee_invoices


class Command(BaseCommand):
    help = "Generate monthly fee invoices for active students."

    def add_arguments(self, parser):
        parser.add_argument("--month", type=int)
        parser.add_argument("--year", type=int)

    def handle(self, *args, **options):
        today = date.today()

        month = options["month"] or today.month
        year = options["year"] or today.year

        if not 1 <= month <= 12:
            raise CommandError("Month must be between 1 and 12.")

        if year < 2000 or year > 9999:
            raise CommandError("Please provide a valid year.")

        result = generate_monthly_fee_invoices(
            month=month,
            year=year,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Monthly invoices processed for {month:02d}/{year}. "
                f"Created: {result['created']}, "
                f"Skipped: {result['skipped']}."
            )
        )

        for error in result["errors"]:
            self.stdout.write(
                self.style.WARNING(
                    f"{error['student_id']}: {error['reason']}"
                )
            )
