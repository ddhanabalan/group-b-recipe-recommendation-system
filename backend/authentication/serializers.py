from rest_framework import serializers
from .models import User,Temp
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["userid","username", "email", "password",'role']
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)

class PasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Ensure the passwords match.
        """
        if data.get('new_password') != data.get('confirm_password'):
            raise serializers.ValidationError("The passwords do not match.")
        return data
class TempSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temp
        fields = ['userid','username', 'email', 'password']