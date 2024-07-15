from rest_framework import serializers
from .models import User, Temp, Feedback
from django.contrib.auth.hashers import make_password
from datetime import date
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["userid","username", "email", "password",'role', 'preference', 'food_type']
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)

class PasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get('new_password')
        if len(password) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")

        # Ensure at least one uppercase letter
        if not any(char.isupper() for char in password):
             raise serializers.ValidationError("Password must contain at least one uppercase letter")

        # Ensure at least one lowercase letter
        if not any(char.islower() for char in password):
            raise serializers.ValidationError("Password must contain at least one lowercase letter")

        # Ensure at least one integer
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError("Password must contain at least one digit")

        # Ensure at least one special character
        if not re.search(r'[!@#$%^&*()_+=\[\]{};\'\\:"|,.<>?]', password):
            raise serializers.ValidationError("Password must contain at least one special character")
        
        #Ensure the passwords match.
        if data.get('new_password') != data.get('confirm_password'):
            raise serializers.ValidationError("The passwords do not match.")
        
        return data
class TempSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temp
        fields = ['userid','username', 'email', 'password', 'created_at']

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
        fields = ['id','userid','category','feedback','feedback_date']
    def create(self, validated_data):
        return super().create(validated_data)

class AllUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["userid","username", "email", 'created_at']

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['preference', 'food_type']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        preference = representation.get('preference', '')
        representation['preference'] = preference.split() if preference else ""
        return representation