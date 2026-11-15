from rest_framework.permissions import BasePermission


class IsApplicationSettingsAdmin(BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        role = str(
            getattr(request.user, "role", "")
        ).upper()

        return role in ["SCHOOL_ADMIN", "SUPER_ADMIN"]