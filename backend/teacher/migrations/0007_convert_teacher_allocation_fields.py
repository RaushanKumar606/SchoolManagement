from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        (
            "teacher",
            "0006_teachersubjectallocation_school_class_new_and_more",
        ),
    ]

    operations = [
        # 1. Remove old text fields.
        #    IMPORTANT: The data we need is already stored in the *_new fields.
        migrations.RemoveField(
            model_name="teachersubjectallocation",
            name="class_name",
        ),
        migrations.RemoveField(
            model_name="teachersubjectallocation",
            name="section",
        ),
        migrations.RemoveField(
            model_name="teachersubjectallocation",
            name="subject",
        ),

        # 2. Rename the temporary FK fields.
        #    RenameField preserves the existing database values.
        migrations.RenameField(
            model_name="teachersubjectallocation",
            old_name="school_class_new",
            new_name="school_class",
        ),
        migrations.RenameField(
            model_name="teachersubjectallocation",
            old_name="section_new",
            new_name="section",
        ),
        migrations.RenameField(
            model_name="teachersubjectallocation",
            old_name="subject_new",
            new_name="subject",
        ),

        # 3. Make the FK fields non-nullable.
        migrations.AlterField(
            model_name="teachersubjectallocation",
            name="school_class",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="teacher_allocations",
                to="academics.schoolclass",
            ),
        ),
        migrations.AlterField(
            model_name="teachersubjectallocation",
            name="section",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="teacher_allocations",
                to="academics.section",
            ),
        ),
        migrations.AlterField(
            model_name="teachersubjectallocation",
            name="subject",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="teacher_allocations",
                to="academics.subject",
            ),
        ),

        # 4. Prevent duplicate teacher/class/section/subject assignments.
        migrations.AddConstraint(
            model_name="teachersubjectallocation",
            constraint=models.UniqueConstraint(
                fields=[
                    "teacher",
                    "school_class",
                    "section",
                    "subject",
                ],
                name="unique_teacher_class_section_subject",
            ),
        ),
    ]