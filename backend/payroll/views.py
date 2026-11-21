from django.db import transaction
from django.utils import timezone
import re
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import SalaryStructure, SalarySlip,EmployeeBankDetails
from .serializers import (
    SalaryStructureSerializer,
    SalarySlipSerializer,
    EmployeeBankDetailsSerializer
)
from .permissions import (
    IsPayrollStaff,
    IsSuperAdmin,
    IsEmployeeSelf,
    get_user_role,
)

class SalaryStructureListCreateView(APIView):
    """
    Salary Structure List + Create

    Accountant:
        Teacher / Staff / Other employee salary structure manage

    School Admin:
        All employee salary structures manage
        including Accountant salary
    """

    permission_classes = [IsAuthenticated, IsPayrollStaff]

    def get(self, request):
        queryset = SalaryStructure.objects.select_related(
            "employee"
        ).all()

        employee_type = request.query_params.get("employee_type")
        employee_id = request.query_params.get("employee")

        if employee_type:
            queryset = queryset.filter(
                employee_type=employee_type.upper()
            )

        if employee_id:
            queryset = queryset.filter(
                employee_id=employee_id
            )

        serializer = SalaryStructureSerializer(
            queryset,
            many=True
        )

        return Response({
            "success": True,
            "count": queryset.count(),
            "data": serializer.data,
        })

    def post(self, request):

        user_role = get_user_role(request.user)

        employee_type = str(
            request.data.get("employee_type", "")
        ).upper()

        # -------------------------------------------------
        # ACCOUNTANT
        # -------------------------------------------------
        # Accountant sirf Teacher / Staff salary structure
        # create kar sakta hai.
        #
        # Accountant ki salary structure
        # School Admin create karega.
        # -------------------------------------------------

        if user_role == "ACCOUNTANT":

            if employee_type == "ACCOUNTANT":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot manage "
                            "Accountant salary structure. "
                            "Only School Admin can manage it."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if employee_type == "SCHOOL_ADMIN":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot manage "
                            "School Admin salary structure."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        # -------------------------------------------------
        # SCHOOL ADMIN
        # -------------------------------------------------
        # School Admin ko all employee types allowed hain.
        # -------------------------------------------------

        serializer = SalaryStructureSerializer(
            data=request.data
        )

        if serializer.is_valid():
            salary = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": (
                        "Salary structure created successfully."
                    ),
                    "data": SalaryStructureSerializer(
                        salary
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

class SalaryStructureDetailView(APIView):
    """
    Salary Structure Detail / Update / Delete

    Accountant:
        Teacher / Staff / Other employee salary manage

    School Admin:
        All salary structures manage
    """

    permission_classes = [IsAuthenticated, IsPayrollStaff]

    def get_object(self, pk):
        try:
            return SalaryStructure.objects.select_related(
                "employee"
            ).get(pk=pk)
        except SalaryStructure.DoesNotExist:
            return None

    def get(self, request, pk):
        salary = self.get_object(pk)

        if not salary:
            return Response(
                {
                    "success": False,
                    "message": "Salary structure not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = SalaryStructureSerializer(salary)

        return Response({
            "success": True,
            "data": serializer.data,
        })

    def put(self, request, pk):
        salary = self.get_object(pk)

        if not salary:
            return Response(
                {
                    "success": False,
                    "message": "Salary structure not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        user_role = get_user_role(request.user)

        # -------------------------------------------------
        # ACCOUNTANT
        # -------------------------------------------------

        if user_role == "ACCOUNTANT":

            if salary.employee_type == "ACCOUNTANT":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot update "
                            "Accountant salary. "
                            "Only School Admin can update it."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if salary.employee_type == "SCHOOL_ADMIN":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot update "
                            "School Admin salary."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        serializer = SalaryStructureSerializer(
            salary,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            updated_salary = serializer.save()

            return Response({
                "success": True,
                "message": (
                    "Salary structure updated successfully."
                ),
                "data": SalaryStructureSerializer(
                    updated_salary
                ).data,
            })

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        salary = self.get_object(pk)

        if not salary:
            return Response(
                {
                    "success": False,
                    "message": "Salary structure not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        user_role = get_user_role(request.user)

        # -------------------------------------------------
        # ACCOUNTANT
        # -------------------------------------------------

        if user_role == "ACCOUNTANT":

            if salary.employee_type == "ACCOUNTANT":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot delete "
                            "Accountant salary. "
                            "Only School Admin can delete it."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if salary.employee_type == "SCHOOL_ADMIN":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot delete "
                            "School Admin salary."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        salary.delete()

        return Response({
            "success": True,
            "message": (
                "Salary structure deleted successfully."
            ),
        })

class SalarySlipListCreateView(APIView):
    """
    Monthly Salary Slip

    Accountant:
        Teacher / Staff / Other employee salary slip manage

    School Admin:
        All salary slips manage
        including Accountant salary
    """

    permission_classes = [IsAuthenticated, IsPayrollStaff]

    def get(self, request):
        queryset = SalarySlip.objects.select_related(
            "employee",
            "salary_structure",
        ).all()

        employee_id = request.query_params.get("employee")
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        status_filter = request.query_params.get("status")

        if employee_id:
            queryset = queryset.filter(
                employee_id=employee_id
            )

        if month:
            queryset = queryset.filter(
                month=month
            )

        if year:
            queryset = queryset.filter(
                year=year
            )

        if status_filter:
            queryset = queryset.filter(
                status=status_filter.upper()
            )

        serializer = SalarySlipSerializer(
            queryset,
            many=True
        )

        return Response({
            "success": True,
            "count": queryset.count(),
            "data": serializer.data,
        })

    @transaction.atomic
    def post(self, request):

        user_role = get_user_role(request.user)

        employee_id = request.data.get("employee")
        salary_structure_id = request.data.get(
            "salary_structure"
        )
        month = request.data.get("month")
        year = request.data.get("year")

        # -------------------------------------------------
        # REQUIRED FIELDS
        # -------------------------------------------------

        if not employee_id:
            return Response(
                {
                    "success": False,
                    "message": "Employee is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not salary_structure_id:
            return Response(
                {
                    "success": False,
                    "message": "Salary structure is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not month:
            return Response(
                {
                    "success": False,
                    "message": "Month is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not year:
            return Response(
                {
                    "success": False,
                    "message": "Year is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # SALARY STRUCTURE
        # -------------------------------------------------

        try:
            salary_structure = SalaryStructure.objects.select_related(
                "employee"
            ).get(
                id=salary_structure_id,
                employee_id=employee_id,
                is_active=True,
            )

        except SalaryStructure.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Valid active salary structure "
                        "for this employee is required."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee_type = salary_structure.employee_type

        # -------------------------------------------------
        # ACCOUNTANT RESTRICTION
        # -------------------------------------------------

        if user_role == "ACCOUNTANT":

            if employee_type == "ACCOUNTANT":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot create "
                            "Accountant salary slip. "
                            "Only School Admin can manage "
                            "Accountant salary."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if employee_type == "SCHOOL_ADMIN":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot create "
                            "School Admin salary slip."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        # -------------------------------------------------
        # DUPLICATE CHECK
        # -------------------------------------------------

        if SalarySlip.objects.filter(
            employee_id=employee_id,
            month=month,
            year=year,
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": (
                        "Salary slip already exists "
                        "for this employee and month."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # SERIALIZER
        # -------------------------------------------------

        serializer = SalarySlipSerializer(
            data=request.data
        )

        if serializer.is_valid():

            salary_slip = serializer.save(
                employee=salary_structure.employee,
                salary_structure=salary_structure,
                basic_salary=salary_structure.basic_salary,
                total_allowance=salary_structure.total_allowance,
                total_deduction=salary_structure.other_deduction,
                net_salary=salary_structure.net_salary,
                status="DRAFT",
            )

            return Response(
                {
                    "success": True,
                    "message": (
                        "Salary slip created successfully."
                    ),
                    "data": SalarySlipSerializer(
                        salary_slip
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

class SalarySlipDetailView(APIView):
    """
    Salary Slip Detail
    """

    permission_classes = [IsAuthenticated, IsPayrollStaff]

    def get_object(self, pk):
        try:
            return SalarySlip.objects.select_related(
                "employee",
                "salary_structure",
            ).get(pk=pk)
        except SalarySlip.DoesNotExist:
            return None

    def get(self, request, pk):
        salary_slip = self.get_object(pk)

        if not salary_slip:
            return Response(
                {
                    "success": False,
                    "message": "Salary slip not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = SalarySlipSerializer(salary_slip)

        return Response({
            "success": True,
            "data": serializer.data,
        })


class SalarySlipApproveView(APIView):
    """
    Salary Slip Approval

    Accountant:
        Teacher / Staff / Other employee salary approve

    School Admin:
        All salary slips approve
        including Accountant salary
    """

    permission_classes = [
        IsAuthenticated,
        IsPayrollStaff,
    ]

    def post(self, request, pk):

        user_role = get_user_role(request.user)

        try:
            salary_slip = SalarySlip.objects.select_related(
                "salary_structure",
                "employee",
            ).get(pk=pk)

        except SalarySlip.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Salary slip not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        employee_type = (
            salary_slip.salary_structure.employee_type
        )

        # -------------------------------------------------
        # ACCOUNTANT RESTRICTION
        # -------------------------------------------------

        if user_role == "ACCOUNTANT":

            if employee_type == "ACCOUNTANT":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot approve "
                            "Accountant salary. "
                            "Only School Admin can approve it."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if employee_type == "SCHOOL_ADMIN":
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant cannot approve "
                            "School Admin salary."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        # -------------------------------------------------
        # STATUS CHECK
        # -------------------------------------------------

        if salary_slip.status == "PAID":
            return Response(
                {
                    "success": False,
                    "message": (
                        "Paid salary cannot be approved again."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if salary_slip.status == "APPROVED":
            return Response(
                {
                    "success": False,
                    "message": (
                        "Salary is already approved."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------------------------------
        # APPROVE
        # -------------------------------------------------

        salary_slip.status = "APPROVED"

        salary_slip.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Salary slip approved successfully."
                ),
                "data": SalarySlipSerializer(
                    salary_slip
                ).data,
            },
            status=status.HTTP_200_OK,
        )



class SalarySlipPayView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsPayrollStaff,
    ]

    @transaction.atomic
    def post(self, request, pk):

        user_role = str(
            get_user_role(request.user)
        ).upper()

        # =====================================
        # GET SALARY SLIP
        # =====================================

        try:
            salary_slip = (
                SalarySlip.objects
                .select_related(
                    "salary_structure",
                    "employee",
                )
                .select_for_update()
                .get(pk=pk)
            )

        except SalarySlip.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Salary slip not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # =====================================
        # EMPLOYEE TYPE PERMISSION
        # =====================================

        employee_type = str(
            salary_slip.salary_structure.employee_type
        ).upper()

        if user_role == "ACCOUNTANT" and employee_type in [
            "ACCOUNTANT",
            "SCHOOL_ADMIN",
        ]:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Accountant cannot pay "
                        "Accountant or School Admin salary."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # =====================================
        # STATUS VALIDATION
        # =====================================

        if salary_slip.status == "PAID":
            return Response(
                {
                    "success": False,
                    "message": "Salary already paid.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if salary_slip.status != "APPROVED":
            return Response(
                {
                    "success": False,
                    "message": (
                        "Only approved salary slips "
                        "can be paid."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # =====================================
        # PAYMENT METHOD
        # =====================================

        payment_method = str(
            request.data.get("payment_method", "")
        ).strip().upper()

        allowed_methods = [
            "BANK",
            "UPI",
            "CASH",
            "CHEQUE",
        ]

        if payment_method not in allowed_methods:
            return Response(
                {
                    "success": False,
                    "message": "Invalid payment method.",
                    "allowed_methods": allowed_methods,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_reference = str(
            request.data.get("payment_reference", "")
        ).strip()

        remarks = str(
            request.data.get("remarks", "")
        ).strip()

        # =====================================
        # FETCH EMPLOYEE BANK DETAILS
        # =====================================

        bank_details = (
            EmployeeBankDetails.objects
            .filter(employee=salary_slip.employee)
            .first()
        )

        # =====================================
        # BANK TRANSFER VALIDATION
        # =====================================

        if payment_method == "BANK":

            if not bank_details:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee bank details "
                            "have not been added."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not bank_details.is_verified:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee bank details "
                            "are not verified."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            account_number = (
                bank_details.account_number or ""
            ).strip()

            if not account_number.isdigit() or not (
                8 <= len(account_number) <= 20
            ):
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee bank account number "
                            "is invalid."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            ifsc_code = (
                bank_details.ifsc_code or ""
            ).strip().upper()

            if not re.fullmatch(
                r"^[A-Z]{4}0[A-Z0-9]{6}$",
                ifsc_code,
            ):
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee IFSC code is invalid."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not payment_reference:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Bank UTR/reference number is required."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # =====================================
        # UPI VALIDATION
        # =====================================

        elif payment_method == "UPI":

            if not bank_details:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee bank/UPI details "
                            "have not been added."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not bank_details.is_verified:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee bank/UPI details "
                            "are not verified."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            upi_id = (
                bank_details.upi_id or ""
            ).strip()

            if not re.fullmatch(
                r"^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$",
                upi_id,
            ):
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Employee UPI ID is missing "
                            "or invalid."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not payment_reference:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "UPI transaction reference "
                            "is required."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # =====================================
        # CHEQUE VALIDATION
        # =====================================

        elif payment_method == "CHEQUE":

            if not payment_reference:
                return Response(
                    {
                        "success": False,
                        "message": "Cheque number is required.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # =====================================
        # SAVE PAYMENT
        # =====================================

        salary_slip.payment_method = payment_method
        salary_slip.payment_reference = (
            payment_reference or None
        )
        salary_slip.remarks = remarks
        salary_slip.paid_by = request.user
        salary_slip.paid_at = timezone.now()
        salary_slip.status = "PAID"

        salary_slip.save(
            update_fields=[
                "payment_method",
                "payment_reference",
                "remarks",
                "paid_by",
                "paid_at",
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "success": True,
                "message": "Salary paid successfully.",
                "data": SalarySlipSerializer(
                    salary_slip
                ).data,
            },
            status=status.HTTP_200_OK,
        )


class MySalarySlipView(APIView):
    """
    Employee apni salary slips dekh sakta hai.

    Teacher / School Admin / Accountant / Staff
    """

    permission_classes = [
        IsAuthenticated,
        IsEmployeeSelf,
    ]

    def get(self, request):
        queryset = SalarySlip.objects.select_related(
            "employee",
            "salary_structure",
            "employee__bank_details",
        ).filter(
            employee=request.user
        )

        serializer = SalarySlipSerializer(
            queryset,
            many=True
        )

        return Response({
            "success": True,
            "count": queryset.count(),
            "data": serializer.data,
        })

# =========================================================
# PAYROLL EMPLOYEE LIST
# =========================================================

class PayrollEmployeeListView(APIView):
    """
    Payroll ke liye employees ki list.

    Accountant:
        TEACHER / STAFF / HR only

    School Admin:
        TEACHER / STAFF / HR / ACCOUNTANT / SCHOOL_ADMIN
    """

    permission_classes = [
        IsAuthenticated,
        IsPayrollStaff,
    ]

    def get(self, request):

        User = get_user_model()

        user_role = get_user_role(request.user)

        queryset = User.objects.all()

        # ---------------------------------------------
        # ACCOUNTANT
        # ---------------------------------------------
        if user_role == "ACCOUNTANT":

            queryset = queryset.filter(
                Q(role__iexact="TEACHER") | Q(role__iexact="STAFF") |
        Q(role__iexact="HR")
            )

        # ---------------------------------------------
        # SCHOOL ADMIN
        # ---------------------------------------------
        elif user_role == "SCHOOL_ADMIN":
          queryset = queryset.filter(
        Q(role__iexact="TEACHER") |
        Q(role__iexact="STAFF") |
        Q(role__iexact="HR") |
        Q(role__iexact="ACCOUNTANT") |
        Q(role__iexact="SCHOOL_ADMIN")
    )

        queryset = queryset.order_by(
            "first_name",
            "last_name",
            "username",
        )

        data = []

        for employee in queryset:

            full_name = employee.get_full_name()

            if not full_name:
                full_name = employee.username

            data.append({
                "id": employee.id,
                "name": full_name,
                "username": employee.username,
                "email": employee.email,
                "role": str(
                    getattr(employee, "role", "")
                ).upper(),
            })

        return Response({
            "success": True,
            "count": len(data),
            "data": data,
        })    


# =========================================================
# EMPLOYEE BANK DETAILS
# =========================================================


class EmployeeBankDetailsListCreateView(APIView):
    """
    Employee bank details list + create.

    Accountant:
        Teacher / Staff / HR ke bank details manage kar sakta hai.

    School Admin:
        All payroll employees ke bank details manage kar sakta hai.

    Super Admin:
        All bank details manage kar sakta hai.
    """

    permission_classes = [
        IsAuthenticated,
        IsPayrollStaff,
    ]

    # =====================================================
    # GET: LIST EMPLOYEE BANK DETAILS
    # =====================================================

    def get(self, request):

        queryset = EmployeeBankDetails.objects.select_related(
            "employee"
        ).all()

        user_role = str(
            get_user_role(request.user)
        ).upper()

        # -----------------------------------------
        # ACCOUNTANT
        # -----------------------------------------

        if user_role == "ACCOUNTANT":

            queryset = queryset.filter(
                Q(employee__role__iexact="TEACHER") |
                Q(employee__role__iexact="STAFF") |
                Q(employee__role__iexact="HR")
            )

        # -----------------------------------------
        # SCHOOL ADMIN
        # -----------------------------------------

        elif user_role == "SCHOOL_ADMIN":

            queryset = queryset.filter(
                Q(employee__role__iexact="TEACHER") |
                Q(employee__role__iexact="STAFF") |
                Q(employee__role__iexact="HR") |
                Q(employee__role__iexact="ACCOUNTANT") |
                Q(employee__role__iexact="SCHOOL_ADMIN")
            )

        # -----------------------------------------
        # SUPER ADMIN
        # -----------------------------------------

        elif user_role == "SUPER_ADMIN":
            pass

        else:
            return Response(
                {
                    "success": False,
                    "message": "Permission denied.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # -----------------------------------------
        # SERIALIZER
        # -----------------------------------------

        serializer = EmployeeBankDetailsSerializer(
            queryset,
            many=True
        )

        return Response(
            {
                "success": True,
                "count": queryset.count(),
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # =====================================================
    # POST: CREATE EMPLOYEE BANK DETAILS
    # =====================================================

    def post(self, request):

        user_role = str(
            get_user_role(request.user)
        ).upper()

        # -----------------------------------------
        # PERMISSION CHECK
        # -----------------------------------------

        if user_role not in [
            "ACCOUNTANT",
            "SCHOOL_ADMIN",
            "SUPER_ADMIN",
        ]:
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # -----------------------------------------
        # VALIDATE REQUEST DATA
        # -----------------------------------------

        serializer = EmployeeBankDetailsSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Invalid bank details.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee = serializer.validated_data.get(
            "employee"
        )

        # -----------------------------------------
        # EMPLOYEE ROLE
        # -----------------------------------------

        employee_role = str(
            getattr(employee, "role", "")
        ).upper()

        # -----------------------------------------
        # ACCOUNTANT RESTRICTION
        # -----------------------------------------

        if user_role == "ACCOUNTANT":

            if employee_role not in [
                "TEACHER",
                "STAFF",
                "HR",
            ]:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Accountant can only manage "
                            "Teacher, Staff and HR bank details."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        # -----------------------------------------
        # SCHOOL ADMIN RESTRICTION
        # -----------------------------------------

        if user_role == "SCHOOL_ADMIN":

            if employee_role not in [
                "TEACHER",
                "STAFF",
                "HR",
                "ACCOUNTANT",
                "SCHOOL_ADMIN",
            ]:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "School Admin cannot manage "
                            "this employee's bank details."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        # -----------------------------------------
        # DUPLICATE CHECK
        # -----------------------------------------

        if EmployeeBankDetails.objects.filter(
            employee=employee
        ).exists():

            return Response(
                {
                    "success": False,
                    "message": (
                        "Bank details already exist "
                        "for this employee. Please update existing details."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -----------------------------------------
        # SAVE BANK DETAILS
        # -----------------------------------------

        bank_details = serializer.save()

        # -----------------------------------------
        # RESPONSE
        # -----------------------------------------

        response_serializer = EmployeeBankDetailsSerializer(
            bank_details
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Employee bank details saved successfully."
                ),
                "data": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

# =========================================================
# EMPLOYEE BANK DETAILS - DETAIL / UPDATE / DELETE
# =========================================================

class EmployeeBankDetailsDetailView(APIView):
    """
    Employee bank details retrieve, update and delete.

    Accountant:
        Teacher / Staff / HR details manage.

    School Admin:
        All payroll employee details manage.

    Super Admin:
        All details manage.
    """

    permission_classes = [
        IsAuthenticated,
        IsPayrollStaff,
    ]

    def get_object(self, pk):

        try:
            return EmployeeBankDetails.objects.select_related(
                "employee"
            ).get(pk=pk)

        except EmployeeBankDetails.DoesNotExist:
            return None

    def check_access(self, request, bank_details):

        user_role = str(
            get_user_role(request.user)
        ).upper()

        employee_role = str(
            getattr(bank_details.employee, "role", "")
        ).upper()

        if user_role == "SUPER_ADMIN":
            return True

        if user_role == "SCHOOL_ADMIN":
            return employee_role in [
                "TEACHER",
                "STAFF",
                "HR",
                "ACCOUNTANT",
                "SCHOOL_ADMIN",
            ]

        if user_role == "ACCOUNTANT":
            return employee_role in [
                "TEACHER",
                "STAFF",
                "HR",
            ]

        return False

    def get(self, request, pk):

        bank_details = self.get_object(pk)

        if not bank_details:
            return Response(
                {
                    "success": False,
                    "message": "Bank details not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not self.check_access(request, bank_details):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EmployeeBankDetailsSerializer(
            bank_details
        )

        return Response(
            {
                "success": True,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        bank_details = self.get_object(pk)

        if not bank_details:
            return Response(
                {
                    "success": False,
                    "message": "Bank details not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not self.check_access(request, bank_details):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Employee cannot be changed through this endpoint.
        if "employee" in request.data:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Employee cannot be changed "
                        "for existing bank details."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EmployeeBankDetailsSerializer(
            bank_details,
            data=request.data,
            partial=False,
        )

        if serializer.is_valid():

            # Any bank detail update requires re-verification.
            updated_details = serializer.save(
                is_verified=False
            )

            return Response(
                {
                    "success": True,
                    "message": (
                        "Bank details updated. "
                        "Admin verification is required again."
                    ),
                    "data": EmployeeBankDetailsSerializer(
                        updated_details
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def patch(self, request, pk):

        bank_details = self.get_object(pk)

        if not bank_details:
            return Response(
                {
                    "success": False,
                    "message": "Bank details not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not self.check_access(request, bank_details):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if "employee" in request.data:
            return Response(
                {
                    "success": False,
                    "message": (
                        "Employee cannot be changed "
                        "for existing bank details."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EmployeeBankDetailsSerializer(
            bank_details,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():

            updated_details = serializer.save(
                is_verified=False
            )

            return Response(
                {
                    "success": True,
                    "message": (
                        "Bank details updated. "
                        "Admin verification is required again."
                    ),
                    "data": EmployeeBankDetailsSerializer(
                        updated_details
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):

        bank_details = self.get_object(pk)

        if not bank_details:
            return Response(
                {
                    "success": False,
                    "message": "Bank details not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not self.check_access(request, bank_details):
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission.",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        bank_details.delete()

        return Response(
            {
                "success": True,
                "message": "Bank details deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )


class EmployeeBankDetailsVerifyView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsPayrollStaff,
    ]

    def post(self, request, pk):

        user_role = str(
            get_user_role(request.user)
        ).upper()

        if user_role not in [
            "ACCOUNTANT",
            "SCHOOL_ADMIN",
            "SUPER_ADMIN",
        ]:
            return Response(
                {
                    "success": False,
                    "message": "You do not have permission to verify bank details."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            bank_details = EmployeeBankDetails.objects.get(
                pk=pk
            )
        except EmployeeBankDetails.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Bank details not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if bank_details.is_verified:
            return Response(
                {
                    "success": True,
                    "message": "Bank details are already verified."
                },
                status=status.HTTP_200_OK
            )

        bank_details.is_verified = True
        bank_details.save(update_fields=["is_verified"])

        serializer = EmployeeBankDetailsSerializer(
            bank_details
        )

        return Response(
            {
                "success": True,
                "message": "Bank details verified successfully.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )