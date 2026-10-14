# from rest_framework.permissions import BasePermission


# def get_user_role(user):
#     """
#     User role ko uppercase mein normalize karta hai.
#     ACCOUNTANT / accountant dono handle honge.
#     """
#     return str(
#         getattr(user, "role", "")
#     ).upper()


# class IsPayrollStaff(BasePermission):
#     """
#     Accountant + School Admin + Super Admin
#     payroll manage kar sakte hain.
#     """

#     def has_permission(self, request, view):

#         if not request.user or not request.user.is_authenticated:
#             return False

#         return get_user_role(request.user) in {
#             "ACCOUNTANT",
#             "SCHOOL_ADMIN",
#             "SUPER_ADMIN",
#         }


# class IsPayrollAdmin(BasePermission):
#     """
#     School Admin + Super Admin
#     payroll administrative operations kar sakte hain.
#     """

#     def has_permission(self, request, view):

#         if not request.user or not request.user.is_authenticated:
#             return False

#         return get_user_role(request.user) in {
#             "SCHOOL_ADMIN",
#             "SUPER_ADMIN",
#         }


# class IsSuperAdmin(BasePermission):
#     """
#     Sirf Super Admin.
#     """

#     def has_permission(self, request, view):

#         if not request.user or not request.user.is_authenticated:
#             return False

#         return (
#             get_user_role(request.user)
#             == "SUPER_ADMIN"
#         )


# class IsAccountant(BasePermission):
#     """
#     Sirf Accountant.
#     """

#     def has_permission(self, request, view):

#         if not request.user or not request.user.is_authenticated:
#             return False

#         return (
#             get_user_role(request.user)
#             == "ACCOUNTANT"
#         )


# class IsEmployeeSelf(BasePermission):
#     """
#     Employee sirf apni salary/slip dekh sakta hai.

#     Teacher
#     School Admin
#     Accountant
#     Staff
#     """

#     def has_permission(self, request, view):

#         if not request.user or not request.user.is_authenticated:
#             return False

#         return get_user_role(request.user) in {
#             "TEACHER",
#             "SCHOOL_ADMIN",
#             "ACCOUNTANT",
#             "STAFF",
#         }

#     def has_object_permission(
#         self,
#         request,
#         view,
#         obj,
#     ):
#         return obj.employee_id == request.user.id

from rest_framework.permissions import BasePermission


# =========================================================
# GET USER ROLE
# =========================================================

def get_user_role(user):
    """
    User role ko uppercase mein return karta hai.
    """

    return str(
        getattr(user, "role", "")
    ).upper()


# =========================================================
# PAYROLL STAFF
# =========================================================

class IsPayrollStaff(BasePermission):
    """
    School Admin aur Accountant payroll manage kar sakte hain.
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return get_user_role(request.user) in {
            "ACCOUNTANT",
            "SCHOOL_ADMIN",
        }


# =========================================================
# PAYROLL ADMIN
# =========================================================

class IsPayrollAdmin(BasePermission):
    """
    Sirf School Admin payroll administration kar sakta hai.
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return get_user_role(request.user) == "SCHOOL_ADMIN"


# =========================================================
# SUPER ADMIN
# =========================================================

class IsSuperAdmin(BasePermission):
    """
    Existing views ke compatibility ke liye.
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return get_user_role(request.user) == "SUPER_ADMIN"


# =========================================================
# ACCOUNTANT
# =========================================================

class IsAccountant(BasePermission):
    """
    Sirf Accountant.
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return get_user_role(request.user) == "ACCOUNTANT"


# =========================================================
# SALARY PAYER
# =========================================================

class IsSalaryPayer(BasePermission):
    """
    Accountant aur School Admin salary pay kar sakte hain.

    Accountant:
        Teacher / Staff / Other

    School Admin:
        All employees
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return get_user_role(request.user) in {
            "ACCOUNTANT",
            "SCHOOL_ADMIN",
        }


# =========================================================
# EMPLOYEE SELF
# =========================================================

class IsEmployeeSelf(BasePermission):
    """
    Employee sirf apni salary dekh sakta hai.
    """

    def has_permission(self, request, view):

        if not request.user:
            return False

        if not request.user.is_authenticated:
            return False

        return get_user_role(request.user) in {
            "TEACHER",
            "STAFF",
            "ACCOUNTANT",
            "HR",
            "SCHOOL_ADMIN",
        }

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        return obj.employee_id == request.user.id