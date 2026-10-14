

from django.db import migrations


def migrate_exam_mark_data(apps, schema_editor):
    ExamMark = apps.get_model("teacher", "ExamMark")
    MainStudent = apps.get_model("students", "Student")
    Subject = apps.get_model("academics", "Subject")

    for mark in ExamMark.objects.all():

        # -----------------------------
        # Migrate Student
        # -----------------------------
        if mark.old_student_id:
            old_student = (
                apps.get_model("teacher", "Student")
                .objects
                .filter(id=mark.old_student_id)
                .first()
            )

            if old_student:
                full_name = old_student.name.strip()

                students = MainStudent.objects.filter(
                    first_name__iexact=full_name
                )

                student = students.first()

                if student:
                    mark.student_id = student.id

        # -----------------------------
        # Migrate Subject
        # -----------------------------
        if mark.old_subject:
            subject = (
                Subject.objects
                .filter(name__iexact=mark.old_subject.strip())
                .first()
            )

            if subject:
                mark.subject_id = subject.id

        mark.save(
            update_fields=[
                "student",
                "subject",
            ]
        )


def reverse_migrate_exam_mark_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        (
            "teacher",
            "0013_exammark_created_at_exammark_old_student_and_more",
        ),
        (
            "students",
            "0001_initial",
        ),
        (
            "academics",
            "0001_initial",
        ),
    ]

    operations = [
        migrations.RunPython(
            migrate_exam_mark_data,
            reverse_migrate_exam_mark_data,
        ),
    ]

