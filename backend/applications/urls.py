
from django.urls import path

from .views import (
    PublicApplicationSettingsView,
    AdminApplicationSettingsView,
)

urlpatterns = [
    path(
        "",
        PublicApplicationSettingsView.as_view(),
        name="public-application-settings",
    ),

    path(
        "admin/",
        AdminApplicationSettingsView.as_view(),
        name="admin-application-settings",
    ),
]
