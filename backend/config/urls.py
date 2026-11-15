
from django.contrib import admin
from django.urls import path, include

from accounts.views import (
    UserSignupView,
    CustomTokenObtainPairView,
    AccountantCreateView,
)

from rest_framework_simplejwt.views import TokenRefreshView

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),

    # Accountant
    path(
        "api/auth/accountants/create/",
        AccountantCreateView.as_view(),
        name="accountant-create",
    ),

    # Application Settings
    path(
        "api/auth/application-settings/",
        include("applications.urls"),
    ),

    # Exams
    path("api/auth/exams/", include("exams.urls")),

    # Payroll
    path("api/auth/payroll/", include("payroll.urls")),

    # Fees
    path("api/auth/fees/", include("fees.urls")),

    # Teacher
    path("api/auth/teacher/", include("teacher.urls")),

    # JWT Login
    path(
        "api/auth/login/",
        CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    # JWT Refresh
    path(
        "api/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # Academics
    path("api/auth/academics/", include("academics.urls")),

    # Signup
    path(
        "api/auth/signup/",
        UserSignupView.as_view(),
        name="signup",
    ),

    # Admissions
    path("api/auth/admissions/", include("admissions.urls")),

    # Students
    path("api/auth/students/", include("students.urls")),

    # Accounts
    path("api/auth/accounts/", include("accounts.urls")),
]


# Local development media files
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
