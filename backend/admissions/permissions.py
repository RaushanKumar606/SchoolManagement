

from rest_framework.permissions import BasePermission


class IsAdmissionAdmin(BasePermission):
    message = "Only School Admin or Super Admin can manage admission applications."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in [
                "SCHOOL_ADMIN",
                "SUPER_ADMIN",
            ]
        )