# School Management System
![Uploading School Management System Banner.png…]()


A full-stack School Management System built using Django REST Framework, React.js, and PostgreSQL to manage school operations through role-based dashboards.

## Features

- JWT Authentication with Access and Refresh Tokens
- Role-Based Access Control
- Student Management
- Teacher Registration and Approval
- Admission Application and Approval
- Academic Year, Class, Section, and Subject Management
- Attendance Management
- Timetable and Assignments
- Examination and Results
- Fee Management and Accounting
- Admin, Teacher, Student, and Accountant Dashboards
- REST API Integration

## Technology Stack

**Frontend**
- React.js
- JavaScript
- React Router
- CSS
- Vite

**Backend**
- Python
- Django
- Django REST Framework
- SimpleJWT

**Database**
- PostgreSQL

## Project Structure

```text
SchoolSystem/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
└── client/
    ├── package.json
    └── src/
        ├── components/
        ├── layouts/
        ├── pages/
        └── services/
```

## Installation and Setup

### 1. Backend Setup

```bash
cd backend
python -m venv venv

```

Activate the environment in Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your PostgreSQL database and Django environment variables before running migrations.

### 2. Database Migration

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 3. Run Backend

```bash
python manage.py runserver
```

Backend URL: `http://127.0.0.1:8000/`

API base URL: `http://127.0.0.1:8000/api/`

### 4. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite.

## Authentication

The application uses JWT authentication.

1. User logs in with valid credentials.
2. Backend returns authentication tokens.
3. Frontend sends the access token in the Authorization header.
4. Refresh token requests a new access token when required.
5. Backend permissions control access to protected APIs.

## Development Guidelines

- Keep API requests inside service modules.
- Use shared API utilities for authentication and token refresh.
- Validate user roles and permissions on the backend.
- Handle loading, errors, and empty states.
- Use pagination or virtualization for large datasets.
- Keep passwords, secret keys, and tokens out of source control.

## Security

- Never commit real credentials or tokens.
- Exclude `.env`, `venv/`, and `node_modules/` from Git.
- Disable Django debug mode in production.
- Configure HTTPS and appropriate access permissions before deployment.

## Future Improvements

- Complete student and staff CRUD operations.
- Improve dashboard performance and virtualization.
- Complete fee, attendance, and examination workflows.
- Add automated tests and deployment configuration.

## License

Add the appropriate license before distributing or publishing this project.
