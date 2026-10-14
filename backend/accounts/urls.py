
from django.urls import path
from .views import (

    ValidateCredentialsView,
    ChangePasswordView,
    AdminSchoolClassListView,
    AdminSectionListView,
)

urlpatterns = [
  

    path(
        "verify/",
        ValidateCredentialsView.as_view(),
        name="verify-credentials",
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    path(
    "classes/",
    AdminSchoolClassListView.as_view(),
    name="admin-school-classes",
),

path(
    "sections/",
    AdminSectionListView.as_view(),
    name="admin-school-sections",
),
]

