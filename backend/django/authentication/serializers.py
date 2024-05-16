from rest_framework import serializers
from .models import User, Temp, Feedback
from django.contrib.auth.hashers import make_password
from datetime import date

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

class ChangeUsernameSerializer(serializers.Serializer):
    new_username = serializers.CharField(max_length=255)

    def validate_new_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id','userid','category','feedback']
    def create(self, validated_data):
        return super().create(validated_data)
