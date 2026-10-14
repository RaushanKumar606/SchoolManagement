from rest_framework import serializers

from .models import SalaryStructure, SalarySlip,EmployeeBankDetails


# =========================================================
# SALARY STRUCTURE SERIALIZER
# =========================================================

class SalaryStructureSerializer(serializers.ModelSerializer):

    employee_name = serializers.SerializerMethodField()
    employee_username = serializers.SerializerMethodField()
    total_allowance = serializers.SerializerMethodField()
    net_salary = serializers.SerializerMethodField()

    class Meta:
        model = SalaryStructure

        fields = [
            "id",
            "employee",
            "employee_name",
            "employee_username",
            "employee_type",
            "basic_salary",
            "house_rent_allowance",
            "transport_allowance",
            "other_allowance",
            "other_deduction",
            "total_allowance",
            "net_salary",
            "effective_from",
            "effective_to",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "total_allowance",
            "net_salary",
            "created_at",
            "updated_at",
        ]

    # =====================================================
    # EMPLOYEE NAME
    # =====================================================

    def get_employee_name(self, obj):
        full_name = obj.employee.get_full_name()

        if full_name:
            return full_name

        return obj.employee.username

    # =====================================================
    # EMPLOYEE USERNAME
    # =====================================================

    def get_employee_username(self, obj):
        return obj.employee.username

    # =====================================================
    # TOTAL ALLOWANCE
    # =====================================================

    def get_total_allowance(self, obj):
        return obj.total_allowance

    # =====================================================
    # NET SALARY
    # =====================================================

    def get_net_salary(self, obj):
        return obj.net_salary

    # =====================================================
    # VALIDATION
    # =====================================================

    def validate(self, attrs):

        employee = attrs.get(
            "employee",
            getattr(self.instance, "employee", None),
        )

        employee_type = attrs.get(
            "employee_type",
            getattr(self.instance, "employee_type", None),
        )

        if employee and employee_type:

            user_role = str(
                getattr(employee, "role", "")
            ).upper()

            role_mapping = {
                "TEACHER": {
                    "TEACHER",
                },
                "SCHOOL_ADMIN": {
                    "SCHOOL_ADMIN",
                },
                "ACCOUNTANT": {
                    "ACCOUNTANT",
                },
                "STAFF": {
                    "STAFF",
                    "HR",
                },
            }

            allowed_roles = role_mapping.get(
                employee_type,
                set(),
            )

            if allowed_roles and user_role not in allowed_roles:
                raise serializers.ValidationError({
                    "employee_type": (
                        f"Selected employee does not have "
                        f"the {employee_type} role."
                    )
                })

        # Prevent negative salary values
        for field in [
            "basic_salary",
            "house_rent_allowance",
            "transport_allowance",
            "other_allowance",
            "other_deduction",
        ]:
            value = attrs.get(field)

            if value is not None and value < 0:
                raise serializers.ValidationError({
                    field: "Amount cannot be negative."
                })

        return attrs



class EmployeeBankDetailsSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_username = serializers.CharField(
        source="employee.username",
        read_only=True,
    )

    class Meta:
        model = EmployeeBankDetails

        fields = [
            "id",
            "employee",
            "employee_username",
            "employee_name",
            "account_holder_name",
            "account_number",
            "ifsc_code",
            "bank_name",
            "branch_name",
            "is_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee_username",
            "employee_name",
            "is_verified",
            "created_at",
            "updated_at",
        ]

    def get_employee_name(self, obj):
        full_name = obj.employee.get_full_name()

        if full_name:
            return full_name

        return obj.employee.username

    def validate_ifsc_code(self, value):
        value = value.strip().upper()

        if len(value) != 11:
            raise serializers.ValidationError(
                "IFSC code must contain exactly 11 characters."
            )

        return value

    def validate_account_number(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "Account number must contain only digits."
            )

        if len(value) < 8 or len(value) > 20:
            raise serializers.ValidationError(
                "Enter a valid bank account number."
            )

        return value


class SalarySlipSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_username = serializers.CharField(
        source="employee.username",
        read_only=True,
    )
    employee_role = serializers.CharField(
        source="employee.role",
        read_only=True,
    )

    salary_structure_details = serializers.SerializerMethodField()

    class Meta:
        model = SalarySlip
        fields = [
            "id",

            # Employee
            "employee",
            "employee_name",
            "employee_username",
            "employee_role",

            # Salary structure
            "salary_structure",
            "salary_structure_details",

            # Salary
            "month",
            "year",
            "basic_salary",
            "total_allowance",
            "total_deduction",
            "net_salary",

            # Status
            "status",

            # Payment
            "payment_method",
            "payment_reference",
            "paid_by",
            "paid_at",

            # Other
            "remarks",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee_name",
            "employee_username",
            "employee_role",
            "salary_structure_details",
            "basic_salary",
            "total_allowance",
            "total_deduction",
            "net_salary",
            "status",
            "paid_by",
            "paid_at",
            "created_at",
            "updated_at",
        ]

    def get_employee_name(self, obj):
        full_name = obj.employee.get_full_name()

        if full_name:
            return full_name

        return obj.employee.username

    def get_salary_structure_details(self, obj):
        structure = obj.salary_structure

        return {
            "id": structure.id,
            "employee_type": structure.employee_type,
            "basic_salary": str(structure.basic_salary),
            "house_rent_allowance": str(
                structure.house_rent_allowance
            ),
            "transport_allowance": str(
                structure.transport_allowance
            ),
            "other_allowance": str(
                structure.other_allowance
            ),
            "other_deduction": str(
                structure.other_deduction
            ),
            "total_allowance": str(
                structure.total_allowance
            ),
            "net_salary": str(
                structure.net_salary
            ),
            "effective_from": structure.effective_from,
            "effective_to": structure.effective_to,
            "is_active": structure.is_active,
        }

    def validate_month(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError(
                "Month must be between 1 and 12."
            )

        return value

    def validate_year(self, value):
        if value < 2000 or value > 2100:
            raise serializers.ValidationError(
                "Enter a valid year."
            )

        return value


# =========================================================
# EMPLOYEE BANK DETAILS SERIALIZER
# =========================================================

class EmployeeBankDetailsSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    employee_username = serializers.CharField(
        source="employee.username",
        read_only=True,
    )
    employee_role = serializers.CharField(
        source="employee.role",
        read_only=True,
    )

    class Meta:
        model = EmployeeBankDetails

        fields = [
            "id",
            "employee",
            "employee_name",
            "employee_username",
            "employee_role",
            "account_holder_name",
            "account_number",
            "ifsc_code",
            "bank_name",
            "branch_name",
            "is_verified",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "employee_name",
            "employee_username",
            "employee_role",
            "is_verified",
            "created_at",
            "updated_at",
        ]

    def get_employee_name(self, obj):
        full_name = obj.employee.get_full_name()

        if full_name:
            return full_name

        return obj.employee.username

    def validate_ifsc_code(self, value):
        value = value.strip().upper()

        if len(value) != 11:
            raise serializers.ValidationError(
                "IFSC code must contain exactly 11 characters."
            )

        return value

    def validate_account_number(self, value):
        value = value.strip()

        if not value.isdigit():
            raise serializers.ValidationError(
                "Account number must contain only digits."
            )

        if len(value) < 8 or len(value) > 20:
            raise serializers.ValidationError(
                "Enter a valid bank account number."
            )

        return value    