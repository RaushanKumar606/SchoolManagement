
from .models import ApplicationSetting


def is_student_admission_open():
    settings = ApplicationSetting.get_settings()
    return settings.student_admission


def is_teacher_hiring_open():
    settings = ApplicationSetting.get_settings()
    return settings.teacher_hiring
