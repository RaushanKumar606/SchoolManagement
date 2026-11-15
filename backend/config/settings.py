
# import os

# from decouple import config

# from pathlib import Path
# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent


# SECRET_KEY = config("SECRET_KEY")
# DEBUG = True

# ALLOWED_HOSTS = []

# # Application definition

# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',

#  # Third Party

#     "rest_framework",
#     "corsheaders",
#     "applications",

#     "accounts",
#     "admissions",
#     "students",
#     "academics",
#     'teacher',
#     'fees',
#     "payroll",
#     "exams"
# ]

# MIDDLEWARE = [
#     # corsheaders middleware shuld 

#     "corsheaders.middleware.CorsMiddleware",

#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',

#       "corsheaders.middleware.CorsMiddleware",
#         "django.middleware.common.CommonMiddleware",
#         # baaki existing middleware ko bhi rakho
# ]

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
#     "https://school-management-orcin-eight.vercel.app/"
# ]

# ROOT_URLCONF = 'config.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'config.wsgi.application'


# # Database
# # DATABASES = {
# #     "default": {
# #         "ENGINE": "django.db.backends.postgresql",
# #         "NAME": "My_Collage_Data",
# #         "USER": "postgres",
# #         "PASSWORD": "Raushan@606",
# #         "HOST": "localhost",
# #         "PORT": "5432",
# #     }
# # }
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": config("DB_NAME"),
#         "USER": config("DB_USER"),
#         "PASSWORD": config("DB_PASSWORD"),
#         "HOST": config("DB_HOST"),
#         "PORT": config("DB_PORT", default="5432"),
#         "OPTIONS": {
#             "sslmode": config("DB_SSLMODE", default="require"),
#         },
#         "CONN_MAX_AGE": 0,
#         "CONN_HEALTH_CHECKS": True,
#         "DISABLE_SERVER_SIDE_CURSORS": True,
#     }
# }

# # Password validation

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]


# # Internationalization
# # https://docs.djangoproject.com/en/6.1/topics/i18n/

# LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'

# USE_I18N = True

# USE_TZ = True


# # Static files (CSS, JavaScript, Images)
# # https://docs.djangoproject.com/en/6.1/howto/static-files/


# STATIC_URL = 'static/'


# # Email
# # https://docs.djangoproject.com/en/6.1/topics/email/#topic-email-configuration

# MAILERS = {
#     'default': {
#         'BACKEND': 'django.core.mail.backends.console.EmailBackend',
#     },
# }


# AUTH_USER_MODEL = "accounts.User"


# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": (
#         "rest_framework_simplejwt.authentication.JWTAuthentication",
#     ),
#     "DEFAULT_PERMISSION_CLASSES": (
#         "rest_framework.permissions.IsAuthenticated",
#     ),

#      "DEFAULT_THROTTLE_CLASSES": (
#         "rest_framework.throttling.ScopedRateThrottle",
#     ),

#     "DEFAULT_THROTTLE_RATES": {
#         "login": "5/min",
#     },
#     "PAGE_SIZE": 20,
# }



# # Razorpay Configuration
# RAZORPAY_KEY_ID = config(
#     "RAZORPAY_KEY_ID",
#     default="",
# ).strip()

# RAZORPAY_KEY_SECRET = config(
#     "RAZORPAY_KEY_SECRET",
#     default="",
# ).strip()



# # Email Configuration (Gmail SMTP)

# # EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# # EMAIL_HOST = 'smtp.gmail.com'
# # EMAIL_PORT = 587
# # EMAIL_USE_TLS = True
# # EMAIL_HOST_USER = 'school@gmail.com'        
# # DEFAULT_FROM_EMAIL = 'School Admin <apni.email@gmail.com>'




import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# =====================================================
# SECURITY
# =====================================================

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", default=False, cast=bool)

ALLOWED_HOSTS = [
    host.strip()
    for host in config(
        "ALLOWED_HOSTS",
        default="localhost,127.0.0.1"
    ).split(",")
    if host.strip()
]

# =====================================================
# APPLICATIONS
# =====================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third Party
    "rest_framework",
    "corsheaders",

    # Local Apps
    "applications",
    "accounts",
    "admissions",
    "students",
    "academics",
    "teacher",
    "fees",
    "payroll",
    "exams",
]

# =====================================================
# MIDDLEWARE
# =====================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # Static files
    "whitenoise.middleware.WhiteNoiseMiddleware",

    # CORS
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =====================================================
# CORS CONFIGURATION
# =====================================================
FRONTEND_URL = config("FRONTEND_URL", default="").strip().rstrip("/")

CORS_ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in config(
        "CORS_ALLOWED_ORIGINS",
        default="http://localhost:5173"
    ).split(",")
    if origin.strip()
]

# FRONTEND_URL ko automatically CORS mein add karega
if FRONTEND_URL and FRONTEND_URL not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL)


CSRF_TRUSTED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in config(
        "CSRF_TRUSTED_ORIGINS",
        default=""
    ).split(",")
    if origin.strip()
]

if FRONTEND_URL and FRONTEND_URL not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(FRONTEND_URL)
# =====================================================
# URL CONFIGURATION
# =====================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"

# =====================================================
# TEMPLATES
# =====================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# =====================================================
# DATABASE
# =====================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST"),
        "PORT": config("DB_PORT", default="5432"),
        "OPTIONS": {
            "sslmode": config("DB_SSLMODE", default="require"),
        },
        "CONN_MAX_AGE": 0,
        "CONN_HEALTH_CHECKS": True,
        "DISABLE_SERVER_SIDE_CURSORS": True,
    }
}

# =====================================================
# PASSWORD VALIDATION
# =====================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# =====================================================
# INTERNATIONALIZATION
# =====================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True
USE_TZ = True

# =====================================================
# STATIC FILES
# =====================================================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# =====================================================
# EMAIL
# =====================================================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# =====================================================
# CUSTOM USER
# =====================================================

AUTH_USER_MODEL = "accounts.User"

# =====================================================
# REST FRAMEWORK
# =====================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),

    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),

    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.ScopedRateThrottle",
    ),

    "DEFAULT_THROTTLE_RATES": {
        "login": "5/min",
    },

    "PAGE_SIZE": 20,
    "DEFAULT_PAGINATION_CLASS": (
    "rest_framework.pagination.PageNumberPagination"
),
"PAGE_SIZE": 20,
}

# =====================================================
# RAZORPAY
# =====================================================

RAZORPAY_KEY_ID = config(
    "RAZORPAY_KEY_ID",
    default="",
).strip()

RAZORPAY_KEY_SECRET = config(
    "RAZORPAY_KEY_SECRET",
    default="",
).strip()

# =====================================================
# PROXY / HTTPS
# =====================================================

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

