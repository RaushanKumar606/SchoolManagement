from rest_framework import serializers

from .models import FeeStructure, FeeInvoice, FeePayment

class FeeStructureSerializer(serializers.ModelSerializer):
    academic_year_name = serializers.CharField(
        source="academic_year.name",
        read_only=True,
    )

    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True,
    )

    total_annual_fee = serializers.SerializerMethodField()

    class Meta:
        model = FeeStructure

        fields = [
            "id",
            "academic_year",
            "academic_year_name",
            "school_class",
            "class_name",
            "monthly_fee",
            "yearly_fee",
            "admission_fee",
            "exam_fee",
            "transport_fee",
            "other_fee",
            "total_annual_fee",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "yearly_fee",
            "total_annual_fee",
            "created_at",
            "updated_at",
        ]

    def get_total_annual_fee(self, obj):
        return obj.total_annual_fee

    def validate(self, attrs):
        academic_year = attrs.get(
            "academic_year",
            getattr(self.instance, "academic_year", None),
        )

        school_class = attrs.get(
            "school_class",
            getattr(self.instance, "school_class", None),
        )

        # Make sure selected class belongs to selected academic year
        if academic_year and school_class:
            if school_class.academic_year_id != academic_year.id:
                raise serializers.ValidationError({
                    "school_class": (
                        "Selected class does not belong to the "
                        "selected academic year."
                    )
                })

        return attrs


class FeeInvoiceSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_id = serializers.CharField(
        source="student.student_id",
        read_only=True,
    )

    invoice_status = serializers.CharField(
        source="status",
        read_only=True,
    )
    fee_particulars = serializers.SerializerMethodField()

    class_name = serializers.CharField(
        source="student.school_class.name",
        read_only=True,
    )

    section_name = serializers.CharField(
        source="student.section.name",
        read_only=True,
    )

    class Meta:
        model = FeeInvoice

        fields = [
            "id",
            "invoice_number",
            "student",
            "student_id",
            "student_name",
            "class_name",
            "section_name",
            "academic_year",
            "fee_structure",
            "fee_particulars",
            "month",
            "year",
            "amount",
            "paid_amount",
            "due_amount",
            "status",
            "invoice_status",
            "due_date",
            "remarks",
            "created_at",
            "updated_at",
            "fee_type",
        ]

        read_only_fields = [
            "invoice_number",
            "paid_amount",
            "due_amount",
            "status",
            "invoice_status",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        student = obj.student

        name = " ".join(
            filter(
                None,
                [
                    student.first_name,
                    student.middle_name,
                    student.last_name,
                ],
            )
        )

        return name.strip()    
    
    def get_fee_particulars(self, obj):
     remarks = (obj.remarks or "").strip()

     if remarks:
        return remarks

     return "School Fees"

class FeePaymentSerializer(serializers.ModelSerializer):

    receipt_number = serializers.CharField(
        read_only=True
    )

    collected_by_name = serializers.SerializerMethodField()

    invoice_number = serializers.CharField(
        source="invoice.invoice_number",
        read_only=True,
    )

    student_name = serializers.SerializerMethodField()

    student_id = serializers.CharField(
        source="invoice.student.student_id",
        read_only=True,
    )

    class_name = serializers.CharField(
        source="invoice.student.school_class.name",
        read_only=True,
    )

    section_name = serializers.CharField(
        source="invoice.student.section.name",
        read_only=True,
    )

    class Meta:
        model = FeePayment

        fields = [
            "id",

            # Invoice
            "invoice",
            "invoice_number",

            # Student
            "student_id",
            "student_name",
            "class_name",
            "section_name",

            # Payment
            "receipt_number",
            "amount",
            "payment_method",
            "payment_status",

            # Transaction
            "transaction_reference",

            # Date
            "payment_date",

            # Accountant
            "collected_by",
            "collected_by_name",

            # Online Gateway
            "gateway_order_id",
            "gateway_payment_id",

            # Other
            "remarks",
            "created_at",
        ]

        read_only_fields = [
            "receipt_number",
            "collected_by",
            "collected_by_name",

            "gateway_order_id",
            "gateway_payment_id",
            "gateway_signature",

            "created_at",
        ]

    def get_collected_by_name(self, obj):

        user = obj.collected_by

        # Online payment
        if not user:
            return "Online Payment"

        full_name = user.get_full_name()

        if full_name:
            return full_name

        return user.username

    def get_student_name(self, obj):

        student = obj.invoice.student

        name = " ".join(
            filter(
                None,
                [
                    student.first_name,
                    student.middle_name,
                    student.last_name,
                ],
            )
        )

        return name.strip()

    def validate_amount(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Payment amount must be greater than zero."
            )

        return value

    