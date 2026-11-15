
from django.db import models


class ApplicationSetting(models.Model):

    student_admission = models.BooleanField(
        default=True,
        help_text="Allow students to submit admission applications."
    )

    teacher_hiring = models.BooleanField(
        default=True,
        help_text="Allow teachers to submit hiring applications."
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Application Setting"
        verbose_name_plural = "Application Settings"

    def __str__(self):
        return "Website Application Settings"

    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings
