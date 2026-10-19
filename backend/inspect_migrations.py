from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT app, name
        FROM django_migrations
        ORDER BY app, name
    """)
    print("MIGRATION RECORDS:", cursor.fetchall())

    cursor.execute("""
        SELECT
            tc.table_name,
            tc.constraint_name,
            tc.constraint_type
        FROM information_schema.table_constraints tc
        WHERE tc.table_schema = 'public'
          AND tc.constraint_type IN ('FOREIGN KEY', 'UNIQUE')
        ORDER BY tc.table_name, tc.constraint_name
    """)
    print("\nFOREIGN KEY / UNIQUE CONSTRAINTS:")
    for row in cursor.fetchall():
        print(row)
