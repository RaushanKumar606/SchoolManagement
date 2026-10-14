from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "School Information",
            {
                "fields": ("role", "phone"),
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "School Information",
            {
                "fields": ("role", "phone"),
            },
        ),
    )