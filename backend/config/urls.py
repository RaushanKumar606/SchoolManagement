
from django.contrib import admin
from django.urls import path, include

from accounts.views import (
    UserSignupView,
    CustomTokenObtainPairView,
    AccountantCreateView,
)

from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
    "api/auth/accountants/create/",
    AccountantCreateView.as_view(),
    name="accountant-create",
),  

path("api/auth/exams/", include("exams.urls")),

    path("api/auth/payroll/", include("payroll.urls")),
      
    path("api/auth/fees/", include("fees.urls")),
    
    
    path('api/auth/teacher/', include('teacher.urls')),
    # JWT Login
    path("api/auth/login/",CustomTokenObtainPairView.as_view(),name="token_obtain_pair",),

      # JWT Refresh
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh",),
    
    #  subject call
    path("api/auth/academics/", include("academics.urls")),
    #  teacher allocatio list subjet wise

    # User Signup
    path("api/auth/signup/",UserSignupView.as_view(),name="signup",),

    # Admissions
    path("api/auth/admissions/",include("admissions.urls"),),

    # Students
    path("api/auth/students/",include("students.urls"),),
    # Accounts
    path("api/auth/accounts/",include("accounts.urls"),),
]