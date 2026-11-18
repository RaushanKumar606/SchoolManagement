
from django.db import transaction
from django.core.exceptions import ValidationError

from students.models import (
    Student,
    ClassRollNumberCounter,
    RollNumberGenerationLock,
)


def generate_class_roll_number(school_class):
    """
    Generate a permanent sequential roll number.
    Academic Year and Section do not reset the sequence.
    """

    with transaction.atomic():

        # Serialize all student approvals.
        RollNumberGenerationLock.objects.select_for_update().get(
            pk=1
        )

        class_key = school_class.name.strip().casefold()

        if not class_key:
            raise ValidationError("Invalid school class name.")

        counter, created = (
            ClassRollNumberCounter.objects
            .get_or_create(
                class_key=class_key,
                defaults={"last_number": 0},
            )
        )

        counter = (
            ClassRollNumberCounter.objects
            .select_for_update()
            .get(pk=counter.pk)
        )

        next_number = counter.last_number + 1

        counter.last_number = next_number
        counter.save(update_fields=["last_number", "updated_at"])

        return f"{next_number:03d}", class_key
