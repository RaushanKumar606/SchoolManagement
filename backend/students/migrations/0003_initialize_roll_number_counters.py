
from django.db import migrations
from django.db.models import Max


def initialize_roll_numbers(apps, schema_editor):

    Student = apps.get_model("students", "Student")
    Counter = apps.get_model(
        "students",
        "ClassRollNumberCounter",
    )
    Lock = apps.get_model(
        "students",
        "RollNumberGenerationLock",
    )

    db_alias = schema_editor.connection.alias

    # Initialize the global generation lock.
    Lock.objects.using(db_alias).get_or_create(
        id=1,
        defaults={
            "description": "Global student roll number lock"
        },
    )

    # Assign roll numbers to existing students.
    students = (
        Student.objects.using(db_alias)
        .filter(
            school_class__isnull=False,
        )
        .select_related("school_class")
        .order_by("id")
    )

    counters = {}

    for student in students:

        class_key = (
            student.school_class.name.strip().casefold()
        )

        if not class_key:
            continue

        # Preserve an existing roll number if present.
        if student.roll_number:
            try:
                number = int(student.roll_number)
            except (ValueError, TypeError):
                number = None

            if number is not None:
                counters[class_key] = max(
                    counters.get(class_key, 0),
                    number,
                )

                student.roll_number_class_key = class_key
                student.save(
                    using=db_alias,
                    update_fields=["roll_number_class_key"],
                )
                continue

        next_number = counters.get(class_key, 0) + 1

        student.roll_number = f"{next_number:03d}"
        student.roll_number_class_key = class_key

        student.save(
            using=db_alias,
            update_fields=[
                "roll_number",
                "roll_number_class_key",
            ],
        )

        counters[class_key] = next_number

    # Initialize permanent counters.
    for class_key, last_number in counters.items():

        Counter.objects.using(db_alias).update_or_create(
            class_key=class_key,
            defaults={
                "last_number": last_number,
            },
        )


def reverse_initialize_roll_numbers(apps, schema_editor):
    # Intentionally preserve generated roll numbers on rollback.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("students", "0002_classrollnumbercounter_rollnumbergenerationlock_and_more"),
    ]

    operations = [
        migrations.RunPython(
            initialize_roll_numbers,
            reverse_initialize_roll_numbers,
        ),
    ]
