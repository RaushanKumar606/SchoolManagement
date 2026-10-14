from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from academics.models import SchoolClass, Section

# =========================================================
# SCHOOL CLASS SERIALIZER
# =========================================================

class AdminSchoolClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "name",
        ]


# =========================================================
# SECTION SERIALIZER
# =========================================================

class AdminSectionSerializer(serializers.ModelSerializer):

    class_name = serializers.CharField(
        source="school_class.name",
        read_only=True,
    )

    class Meta:
        model = Section
        fields = [
            "id",
            "name",
            "school_class",
            "class_name",
        ]


# =========================================================
# JWT TOKEN SERIALIZER
# =========================================================
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["role"] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        data["user"] = {
            "id": user.id,
            "username": user.username,
            "role": user.role,
        }

        return data