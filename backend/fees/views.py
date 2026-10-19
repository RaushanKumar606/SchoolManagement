import razorpay
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from calendar import monthrange
from datetime import date

from .models import FeeStructure
from .serializers import FeeStructureSerializer

from django.db import transaction
from decimal import Decimal
from django.db.models import Sum
from django.db.models.functions import Coalesce

from .models import FeeStructure, FeeInvoice, FeePayment
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from students.models import Student
from .serializers import (
    FeeInvoiceSerializer,
    FeePaymentSerializer,
)


ALLOWED_ROLES = {
    "ACCOUNTANT",
    "SCHOOL_ADMIN",
    "SUPER_ADMIN",
}

from django.conf import settings
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from .models import (
    FeeInvoice,
    FeePayment,
    FeeOnlineOrder,
)



import logging
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

logger = logging.getLogger(__name__)



def has_fee_access(user):
    if not user or not user.is_authenticated:
        return False

    return str(getattr(user, "role", "")).upper() in ALLOWED_ROLES


class FeeStructureListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to access fee structures.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = FeeStructure.objects.select_related(
            "academic_year",
            "school_class",
        ).all()

        academic_year_id = request.query_params.get("academic_year")
        school_class_id = request.query_params.get("school_class")
        is_active = request.query_params.get("is_active")

        if academic_year_id:
            queryset = queryset.filter(
                academic_year_id=academic_year_id
            )

        if school_class_id:
            queryset = queryset.filter(
                school_class_id=school_class_id
            )

        if is_active is not None:
            queryset = queryset.filter(
                is_active=is_active.lower() == "true"
            )

        serializer = FeeStructureSerializer(
            queryset,
            many=True,
        )

        return Response(
            {
                "success": True,
                "count": queryset.count(),
                "data": serializer.data,
            }
        )

    def post(self, request):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to create fee structures.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = FeeStructureSerializer(
            data=request.data
        )

        if serializer.is_valid():
            fee_structure = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Fee structure created successfully.",
                    "data": FeeStructureSerializer(
                        fee_structure
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class FeeStructureDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return FeeStructure.objects.select_related(
                "academic_year",
                "school_class",
            ).get(pk=pk)

        except FeeStructure.DoesNotExist:
            return None

    def get(self, request, pk):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to access fee structures.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        fee_structure = self.get_object(pk)

        if not fee_structure:
            return Response(
                {
                    "success": False,
                    "message": "Fee structure not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "success": True,
                "data": FeeStructureSerializer(
                    fee_structure
                ).data,
            }
        )

    def put(self, request, pk):
        return self._update(request, pk)

    def patch(self, request, pk):
        return self._update(request, pk)

    def _update(self, request, pk):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to update fee structures.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        fee_structure = self.get_object(pk)

        if not fee_structure:
            return Response(
                {
                    "success": False,
                    "message": "Fee structure not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = FeeStructureSerializer(
            fee_structure,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            updated_fee = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Fee structure updated successfully.",
                    "data": FeeStructureSerializer(
                        updated_fee
                    ).data,
                }
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to delete fee structures.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        fee_structure = self.get_object(pk)

        if not fee_structure:
            return Response(
                {
                    "success": False,
                    "message": "Fee structure not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        fee_structure.delete()

        return Response(
            {
                "success": True,
                "message": "Fee structure deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )

class FeeInvoiceListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to access fee invoices.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = FeeInvoice.objects.select_related(
            "student",
            "academic_year",
            "fee_structure",
            "student__school_class",
            "student__section",
        ).all()

        student_id = request.query_params.get("student")
        academic_year_id = request.query_params.get("academic_year")
        invoice_status = request.query_params.get("status")

        if student_id:
            queryset = queryset.filter(
                student_id=student_id
            )

        if academic_year_id:
            queryset = queryset.filter(
                academic_year_id=academic_year_id
            )

        if invoice_status:
            queryset = queryset.filter(
                status=invoice_status.upper()
            )

        serializer = FeeInvoiceSerializer(
            queryset,
            many=True,
        )

        return Response(
            {
                "success": True,
                "count": queryset.count(),
                "data": serializer.data,
            }
        )

    def post(self, request):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to create fee invoices.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = FeeInvoiceSerializer(
            data=request.data
        )

        if serializer.is_valid():
            invoice = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Fee invoice created successfully.",
                    "data": FeeInvoiceSerializer(invoice).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

class FeePaymentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # =========================================================
    # GET - Fee Payments List
    # =========================================================
    def get(self, request):

        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": (
                        "You do not have permission "
                        "to access fee payments."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        queryset = (
            FeePayment.objects
            .select_related(
                "invoice",
                "invoice__student",
                "invoice__student__school_class",
                "invoice__student__section",
                "collected_by",
            )
            .all()
        )

        # =====================================================
        # Filters
        # =====================================================

        student_id = request.query_params.get("student")
        invoice_id = request.query_params.get("invoice")
        payment_method = request.query_params.get("payment_method")
        payment_status = request.query_params.get("payment_status")

        # =====================================================
        # Student Filter
        # Example:
        # ?student=STU-00003
        # =====================================================

        if student_id:
            queryset = queryset.filter(
                invoice__student__student_id=student_id
            )

        # =====================================================
        # Invoice Filter
        # Example:
        # ?invoice=1
        # =====================================================

        if invoice_id:
            queryset = queryset.filter(
                invoice_id=invoice_id
            )

        # =====================================================
        # Payment Method Filter
        # Example:
        # ?payment_method=ONLINE
        # =====================================================

        if payment_method:
            queryset = queryset.filter(
                payment_method=payment_method.upper()
            )

        # =====================================================
        # Payment Status Filter
        # Example:
        # ?payment_status=SUCCESS
        # =====================================================

        if payment_status:
            queryset = queryset.filter(
                payment_status=payment_status.upper()
            )

        serializer = FeePaymentSerializer(
            queryset,
            many=True,
        )

        return Response(
            {
                "success": True,
                "count": queryset.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # =========================================================
    # POST - Offline Fee Payment
    # =========================================================
    @transaction.atomic
    def post(self, request):

        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": (
                        "You do not have permission "
                        "to collect fees."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # =====================================================
        # Invoice
        # =====================================================

        invoice_id = request.data.get("invoice")

        if not invoice_id:
            return Response(
                {
                    "success": False,
                    "message": "Invoice is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            invoice = (
                FeeInvoice.objects
                .select_for_update()
                .select_related(
                    "student",
                    "academic_year",
                    "fee_structure",
                )
                .get(id=invoice_id)
            )

        except FeeInvoice.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Fee invoice not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # =====================================================
        # Cancelled Invoice Check
        # =====================================================

        if invoice.status == "CANCELLED":
            return Response(
                {
                    "success": False,
                    "message": (
                        "Cancelled invoice cannot "
                        "receive payment."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # Fully Paid Check
        # =====================================================

        if invoice.due_amount <= 0:
            return Response(
                {
                    "success": False,
                    "message": (
                        "This invoice is already "
                        "fully paid."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # Payment Amount
        # =====================================================

        raw_amount = request.data.get("amount")

        if raw_amount in [None, ""]:
            return Response(
                {
                    "success": False,
                    "message": "Payment amount is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment_amount = Decimal(
                str(raw_amount)
            )
        except (TypeError, ValueError, ArithmeticError):
            return Response(
                {
                    "success": False,
                    "message": "Valid payment amount is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # Amount Validation
        # =====================================================

        if payment_amount <= 0:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Payment amount must be "
                        "greater than zero."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payment_amount > invoice.due_amount:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Payment cannot exceed due amount "
                        f"₹{invoice.due_amount}."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # Payment Method
        # =====================================================

        payment_method = request.data.get(
            "payment_method"
        )

        if not payment_method:
            return Response(
                {
                    "success": False,
                    "message": "Payment method is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_method = payment_method.upper()

        # ONLINE payment must NOT be manually created
        # through this offline API.
        if payment_method == "ONLINE":
            return Response(
                {
                    "success": False,
                    "message": (
                        "Online payments must be processed "
                        "through the online payment gateway."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_offline_methods = {
            "CASH",
            "UPI",
            "BANK",
            "CARD",
            "CHEQUE",
        }

        if payment_method not in allowed_offline_methods:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Invalid offline payment method."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # Prepare Payment Data
        # =====================================================

        payment_data = request.data.copy()

        payment_data["invoice"] = invoice.id
        payment_data["amount"] = str(payment_amount)

        # Backend controls these values
        payment_data["payment_method"] = payment_method
        payment_data["payment_status"] = "SUCCESS"

        # =====================================================
        # Serializer Validation
        # =====================================================

        serializer = FeePaymentSerializer(
            data=payment_data
        )

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================================
        # Create Payment
        # =====================================================

        payment = serializer.save(
            collected_by=request.user,
            payment_status="SUCCESS",
            payment_method=payment_method,
        )

        # =====================================================
        # Update Invoice
        # =====================================================

        invoice.paid_amount += payment.amount
        invoice.save()

        # =====================================================
        # Final Response
        # =====================================================

        return Response(
            {
                "success": True,
                "message": (
                    "Fee payment collected successfully."
                ),
                "data": {
                    "payment": FeePaymentSerializer(
                        payment
                    ).data,
                    "invoice": FeeInvoiceSerializer(
                        invoice
                    ).data,
                },
            },
            status=status.HTTP_201_CREATED,
        )

class FeeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to access fee dashboard.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        invoices = FeeInvoice.objects.all()
        payments = FeePayment.objects.all()

        total_invoiced = invoices.exclude(
            status="CANCELLED"
        ).aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0.00"),
            )
        )["total"]

        total_collected = payments.aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0.00"),
            )
        )["total"]

        total_due = invoices.exclude(
            status="CANCELLED"
        ).aggregate(
            total=Coalesce(
                Sum("due_amount"),
                Decimal("0.00"),
            )
        )["total"]

        pending_invoices = invoices.filter(
            status="PENDING"
        ).count()

        partial_invoices = invoices.filter(
            status="PARTIAL"
        ).count()

        paid_invoices = invoices.filter(
            status="PAID"
        ).count()

        cancelled_invoices = invoices.filter(
            status="CANCELLED"
        ).count()

        return Response(
            {
                "success": True,
                "data": {
                    "total_invoiced": total_invoiced,
                    "total_collected": total_collected,
                    "total_due": total_due,

                    "invoice_summary": {
                        "pending": pending_invoices,
                        "partial": partial_invoices,
                        "paid": paid_invoices,
                        "cancelled": cancelled_invoices,
                    },
                },
            }
        )      


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_fee_online_order(request):
    from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
    from students.models import Student

    # 1. Validate Razorpay configuration
    key_id = (settings.RAZORPAY_KEY_ID or "").strip()
    key_secret = (settings.RAZORPAY_KEY_SECRET or "").strip()

    if not key_id or not key_secret:
        return Response(
            {
                "success": False,
                "message": "Razorpay credentials are not configured.",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # 2. Get logged-in student's active profile
    try:
        student = Student.objects.select_related(
            "user",
            "academic_year",
            "school_class",
            "section",
        ).get(
            user=request.user,
            is_active=True,
        )
    except Student.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Active student profile not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # 3. Validate invoice ID
    invoice_id = request.data.get("invoice")

    if not invoice_id:
        return Response(
            {
                "success": False,
                "message": "Invoice ID is required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 4. Fetch only this student's invoice and lock the row
    try:
        invoice = (
            FeeInvoice.objects
            .select_for_update()
            .select_related(
                "student",
                "academic_year",
                "fee_structure",
            )
            .get(
                id=invoice_id,
                student=student,
            )
        )
    except (FeeInvoice.DoesNotExist, ValueError, TypeError):
        return Response(
            {
                "success": False,
                "message": "Invoice not found or invalid invoice ID.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # 5. Validate invoice status
    if invoice.status == "CANCELLED":
        return Response(
            {
                "success": False,
                "message": "Cancelled invoice cannot be paid.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 6. Read outstanding balance and requested payment amount
    try:
        due_amount = Decimal(str(invoice.due_amount))
        requested_amount = Decimal(
            str(request.data.get("amount", ""))
        )
    except (InvalidOperation, ValueError, TypeError):
        return Response(
            {
                "success": False,
                "message": "Please enter a valid payment amount.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not due_amount.is_finite() or due_amount <= 0:
        return Response(
            {
                "success": False,
                "message": "This invoice is already fully paid.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not requested_amount.is_finite() or requested_amount <= 0:
        return Response(
            {
                "success": False,
                "message": "Payment amount must be greater than zero.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 7. Prevent payment exceeding the pending balance
    if requested_amount > due_amount:
        return Response(
            {
                "success": False,
                "message": (
                    f"Payment cannot exceed pending fees of ₹{due_amount}."
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 8. Allow a maximum of two decimal places
    if requested_amount != requested_amount.quantize(Decimal("0.01")):
        return Response(
            {
                "success": False,
                "message": (
                    "Payment amount can have at most two decimal places."
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 9. Convert the requested rupee amount into paise
    amount_paise = int(
        (requested_amount * Decimal("100")).quantize(
            Decimal("1"),
            rounding=ROUND_HALF_UP,
        )
    )

    if amount_paise <= 0:
        return Response(
            {
                "success": False,
                "message": "Payment amount must be greater than zero.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 10. Initialize Razorpay client
    client = razorpay.Client(
        auth=(key_id, key_secret)
    )

    # 11. Create Razorpay order for the CUSTOM amount
    try:
        razorpay_order = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "receipt": f"fee_{invoice.id}",
                "notes": {
                    "invoice_id": str(invoice.id),
                    "student_id": str(student.student_id),
                },
            }
        )

        razorpay_order_id = razorpay_order.get("id")

        if not razorpay_order_id:
            logger.error(
                "Razorpay response did not contain an order ID."
            )
            return Response(
                {
                    "success": False,
                    "message": "Razorpay did not return an order ID.",
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

    except Exception:
        logger.exception("Razorpay create-order request failed.")
        return Response(
            {
                "success": False,
                "message": (
                    "Unable to create online payment order. "
                    "Check backend logs."
                ),
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # 12. Save the actual requested amount, not the full pending balance
    try:
        online_order = FeeOnlineOrder.objects.create(
            invoice=invoice,
            student=student,
            order_id=razorpay_order_id,
            amount=requested_amount,
            status="CREATED",
        )
    except Exception:
        logger.exception(
            "Razorpay order created, but local database save failed."
        )
        raise

    # 13. Build student name
    student_name = " ".join(
        filter(
            None,
            [
                student.first_name,
                student.middle_name,
                student.last_name,
            ],
        )
    ).strip()

    # 14. Return order details to React
    return Response(
        {
            "success": True,
            "message": "Online payment order created successfully.",
            "data": {
                "order_id": online_order.order_id,
                "amount": amount_paise,
                "amount_rupees": str(requested_amount),
                "currency": "INR",
                "key_id": key_id,
                "invoice": {
                    "id": invoice.id,
                    "invoice_number": invoice.invoice_number,
                    "amount": str(invoice.amount),
                    "paid_amount": str(invoice.paid_amount),
                    "due_amount": str(due_amount),
                },
                "student": {
                    "student_id": student.student_id,
                    "name": student_name,
                },
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def verify_fee_online_payment(request):

    from students.models import Student

    # ------------------------------------------------
    # 1. Get payment data
    # ------------------------------------------------

    razorpay_order_id = request.data.get(
        "razorpay_order_id"
    )

    razorpay_payment_id = request.data.get(
        "razorpay_payment_id"
    )

    razorpay_signature = request.data.get(
        "razorpay_signature"
    )

    if not razorpay_order_id:
        return Response(
            {
                "success": False,
                "message": "Razorpay order ID is required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not razorpay_payment_id:
        return Response(
            {
                "success": False,
                "message": "Razorpay payment ID is required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not razorpay_signature:
        return Response(
            {
                "success": False,
                "message": "Razorpay signature is required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------------
    # 2. Get logged-in student
    # ------------------------------------------------

    try:

        student = Student.objects.get(
            user=request.user,
            is_active=True,
        )

    except Student.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Student profile not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # ------------------------------------------------
    # 3. Get our online order
    # ------------------------------------------------

    try:

        online_order = (
            FeeOnlineOrder.objects
            .select_for_update()
            .select_related(
                "invoice",
                "student",
            )
            .get(
                order_id=razorpay_order_id,
                student=student,
            )
        )

    except FeeOnlineOrder.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Online payment order not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # ------------------------------------------------
    # 4. Prevent duplicate payment
    # ------------------------------------------------

    existing_payment = FeePayment.objects.filter(
        gateway_payment_id=razorpay_payment_id
    ).first()

    if existing_payment:

        return Response(
            {
                "success": True,
                "message": "Payment has already been processed.",
                "data": FeePaymentSerializer(
                    existing_payment
                ).data,
            }
        )

    # ------------------------------------------------
    # 5. Check order status
    # ------------------------------------------------

    if online_order.status == "PAID":

        return Response(
            {
                "success": False,
                "message": "This online order has already been paid.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------------
    # 6. Verify Razorpay signature
    # ------------------------------------------------

    client = razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET,
        )
    )

    verification_data = {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": razorpay_signature,
    }

    try:

        client.utility.verify_payment_signature(
            verification_data
        )

    except Exception:

        online_order.status = "FAILED"
        online_order.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": False,
                "message": "Payment signature verification failed.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------------
    # 7. Lock invoice
    # ------------------------------------------------

    invoice = (
        FeeInvoice.objects
        .select_for_update()
        .get(
            id=online_order.invoice_id,
            student=student,
        )
    )

    # ------------------------------------------------
    # 8. Check invoice
    # ------------------------------------------------

    if invoice.status == "CANCELLED":

        return Response(
            {
                "success": False,
                "message": "Cancelled invoice cannot be paid.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if invoice.due_amount <= 0:

        return Response(
            {
                "success": False,
                "message": "Invoice is already fully paid.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------------
    # 9. Payment amount
    # ------------------------------------------------

    payment_amount = online_order.amount

    # Safety check
    if payment_amount > invoice.due_amount:

        return Response(
            {
                "success": False,
                "message": "Payment amount exceeds invoice due amount.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ------------------------------------------------
    # 10. Create FeePayment
    # ------------------------------------------------

    payment = FeePayment.objects.create(

        invoice=invoice,

        amount=payment_amount,

        payment_method="ONLINE",

        payment_status="SUCCESS",

        payment_date=timezone.localdate(),

        collected_by=None,

        transaction_reference=razorpay_payment_id,

        gateway_order_id=razorpay_order_id,

        gateway_payment_id=razorpay_payment_id,

        gateway_signature=razorpay_signature,

        remarks="Online fee payment via Razorpay",
    )

    # ------------------------------------------------
    # 11. Update invoice
    # ------------------------------------------------

    invoice.paid_amount += payment.amount

    invoice.save()

    # ------------------------------------------------
    # 12. Mark online order as PAID
    # ------------------------------------------------

    online_order.status = "PAID"

    online_order.payment_id = razorpay_payment_id

    online_order.save(
        update_fields=[
            "status",
            "payment_id",
            "updated_at",
        ]
    )

    # ------------------------------------------------
    # 13. Return response
    # ------------------------------------------------

    return Response(
        {
            "success": True,
            "message": "Online fee payment verified successfully.",

            "data": {
                "payment": FeePaymentSerializer(
                    payment
                ).data,

                "invoice": {
                    "id": invoice.id,
                    "invoice_number": invoice.invoice_number,
                    "amount": str(invoice.amount),
                    "paid_amount": str(
                        invoice.paid_amount
                    ),
                    "due_amount": str(
                        invoice.due_amount
                    ),
                    "status": invoice.status,
                },
            },
        },
        status=status.HTTP_200_OK,
    )



class FeeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not has_fee_access(request.user):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to access fee dashboard."
                },
                status=403,
            )

        # Existing invoice records
        invoices = (
            FeeInvoice.objects
            .select_related(
                "student",
                "student__school_class",
                "student__section",
                "academic_year",
                "fee_structure",
            )
            .all()
        )

        # Exclude cancelled invoices from financial totals
        active_invoices = invoices.exclude(status="CANCELLED")

        # Only successful payments count as collected fees
        successful_payments = FeePayment.objects.filter(
            payment_status="SUCCESS"
        )

        total_invoiced = active_invoices.aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0.00"),
            )
        )["total"]

        total_collected = successful_payments.aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0.00"),
            )
        )["total"]

        total_due = active_invoices.aggregate(
            total=Coalesce(
                Sum("due_amount"),
                Decimal("0.00"),
            )
        )["total"]

        # Invoice status counts
        pending_invoices = active_invoices.filter(
            status="PENDING"
        ).count()

        partial_invoices = active_invoices.filter(
            status="PARTIAL"
        ).count()

        paid_invoices = active_invoices.filter(
            status="PAID"
        ).count()

        cancelled_invoices = invoices.filter(
            status="CANCELLED"
        ).count()

        # Student-wise fee records
        fee_records = FeeInvoiceSerializer(
            invoices,
            many=True,
        ).data

        # Latest 10 successful payments
        recent_payments = (
            successful_payments
            .select_related(
                "invoice",
                "invoice__student",
                "invoice__student__school_class",
                "invoice__student__section",
                "collected_by",
            )
            .order_by("-payment_date", "-id")[:10]
        )

        recent_payments_data = FeePaymentSerializer(
            recent_payments,
            many=True,
        ).data

        return Response({
            "success": True,
            "data": {
                "total_invoiced": total_invoiced,
                "total_collected": total_collected,
                "total_due": total_due,

                "invoice_summary": {
                    "pending": pending_invoices,
                    "partial": partial_invoices,
                    "paid": paid_invoices,
                    "cancelled": cancelled_invoices,
                },

                "fee_records": fee_records,
                "recent_payments": recent_payments_data,
            },
        })



class MyFeeStructureView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Logged-in student ka profile fetch karo
        try:
            student = Student.objects.select_related(
                "academic_year",
                "school_class"
            ).get(
                user=request.user,
                is_active=True
            )
        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Student profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Student ki class aur academic year ki active fee structure
        fee_structure = FeeStructure.objects.select_related(
            "academic_year",
            "school_class"
        ).filter(
            academic_year=student.academic_year,
            school_class=student.school_class,
            is_active=True
        ).first()

        if not fee_structure:
            return Response(
                {
                    "success": False,
                    "message": (
                        "No active fee structure found "
                        "for your class and academic year."
                    )
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = FeeStructureSerializer(fee_structure)

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class MyFeeInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Logged-in student
        try:
            student = Student.objects.select_related(
                "academic_year",
                "school_class",
                "section",
            ).get(
                user=request.user,
                is_active=True,
            )
        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Student profile not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # 2. Validate academic details
        if not student.academic_year or not student.school_class:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Your academic year or class is not assigned. "
                        "Please contact the school administrator."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. Find active fee structure
        fee_structure = FeeStructure.objects.filter(
            academic_year=student.academic_year,
            school_class=student.school_class,
            is_active=True,
        ).first()

        if not fee_structure:
            return Response(
                {
                    "success": False,
                    "message": (
                        "No active fee structure found "
                        "for your class and academic year."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # 4. Current monthly invoice details
        today = timezone.localdate()
        last_day = monthrange(today.year, today.month)[1]
        due_date = date(
            today.year,
            today.month,
            min(10, last_day),
        )

        # 5. Create this month's invoice if it doesn't exist
        invoice, created = FeeInvoice.objects.get_or_create(
            student=student,
            month=today.month,
            year=today.year,
            defaults={
                "academic_year": student.academic_year,
                "fee_structure": fee_structure,
                "amount": fee_structure.monthly_fee,
                "due_date": due_date,
                "remarks": (
                    f"Monthly fee invoice for "
                    f"{today.strftime('%B %Y')}"
                ),
            },
        )

        # 6. Return all invoices belonging to this student
        invoices = FeeInvoice.objects.filter(
            student=student,
        ).order_by("-year", "-month", "-id")

        serializer = FeeInvoiceSerializer(
            invoices,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Monthly invoice generated successfully."
                    if created
                    else "Student invoices fetched successfully."
                ),
                "invoice_created": created,
                "count": invoices.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class MyFeePaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            student = Student.objects.get(
                user=request.user,
                is_active=True
            )
        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Student profile not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        payments = FeePayment.objects.filter(
            invoice__student=student
        ).order_by("-id")

        serializer = FeePaymentSerializer(
            payments,
            many=True
        )

        return Response(
            {
                "success": True,
                "count": payments.count(),
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )