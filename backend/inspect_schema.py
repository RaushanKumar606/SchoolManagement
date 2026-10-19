from django.db import connection

tables = [
    "accounts_user",
    "academics_academicyear",
    "academics_schoolclass",
    "academics_section",
    "academics_subject",
    "academics_classsubject",
    "teacher_teacher",
    "teachers_teacher",
]

with connection.cursor() as cursor:
    for table in tables:
        cursor.execute("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = %s
            ORDER BY ordinal_position
        """, [table])

        columns = [row[0] for row in cursor.fetchall()]
        print(f"\n{table}: {', '.join(columns)}")
