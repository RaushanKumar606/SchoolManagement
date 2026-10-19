
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSchoolAdminOrSuperAdmin(BasePermission):
    """
    Read access: authenticated users.
    Write access: SCHOOL_ADMIN and SUPER_ADMIN only.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        role = str(getattr(user, "role", "")).upper()

        return (
            user.is_superuser
            or role in {"SCHOOL_ADMIN", "SUPER_ADMIN"}
        )
