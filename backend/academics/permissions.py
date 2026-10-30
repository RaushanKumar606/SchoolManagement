
from rest_framework.permissions import BasePermission, SAFE_METHODS


def get_user_role(user):
    return str(getattr(user, "role", "") or "").strip().upper()


class IsSchoolAdminOrSuperAdmin(BasePermission):
    """
    Read access: authenticated users.
    Write access: School Admin and Super Admin only.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        role = get_user_role(user)

        return (
            user.is_superuser
            or role in {"SCHOOL_ADMIN", "SUPER_ADMIN"}
        )


class TimetableAdminPermission(BasePermission):
    """
    Only School Admin and Super Admin can manage timetables.
    """

    message = "Only School Admin or Super Admin can manage timetables."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        role = get_user_role(user)

        return (
            user.is_superuser
            or role in {"SCHOOL_ADMIN", "SUPER_ADMIN"}
        )


class TimetablePermission(BasePermission):
    """
    Authenticated users can read timetable data.
    Only School Admin and Super Admin can modify it.
    """

    message = "You do not have permission to modify this timetable."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        role = get_user_role(user)

        return (
            user.is_superuser
            or role in {"SCHOOL_ADMIN", "SUPER_ADMIN"}
        )
