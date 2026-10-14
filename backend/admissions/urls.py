from django.urls import path

from .views import (
    AdmissionApplicationCreateView,
    AdmissionApplicationListView,
    AdmissionApplicationDetailView,
    AdmissionApplicationStatusView,
    ApproveAdmissionView,
)

urlpatterns = [
    path(
        "apply/",
        AdmissionApplicationCreateView.as_view(),
        name="admission-apply",
    ),

    path(
        "list/",
        AdmissionApplicationListView.as_view(),
        name="admission-list",
    ),

     # Admin admission details
    path(
        "<int:pk>/",
        AdmissionApplicationDetailView.as_view(),
        name="admission-detail",
    ),

    # Admin approve/reject/review
    path(
        "<int:pk>/status/",
        AdmissionApplicationStatusView.as_view(),
        name="admission-status",
    ),

    path(
    "<int:pk>/create-student/",
    ApproveAdmissionView.as_view(),
    name="admission-create-student",
),
]