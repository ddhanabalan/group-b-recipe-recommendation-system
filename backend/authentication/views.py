from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer, PasswordResetSerializer
from django.core.mail import send_mail,EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import random
import string
from django.contrib.auth.hashers import check_password, make_password
from .tokens import custom_token_generator
from django.conf import settings
from django.utils.html import strip_tags

def generate_unique_userid():
    while True:
        userid = ''.join(random.choices(string.digits, k=8))
        if not User.objects.filter(userid=userid).exists():
            return userid

class UserSignup(APIView):
    
    def post(self, request):
        userid = generate_unique_userid()
        serializer = UserSerializer(data={**request.data, 'userid': userid})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(username=username)
            if user is not None and check_password(password, user.password):
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

# ForgotPassword view for initiating the password reset process
class ForgotPassword(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with provided email does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = custom_token_generator.make_token(user)
        reset_link = f"{request.scheme}://{request.get_host()}/authentication/reset/{uidb64}/{token}/"
        print(f"reset link = {reset_link}\nuidb64 = {uidb64}\ntoken = {token}\nuser = {user}")
        email_subject = 'Password Reset'
        email_body = render_to_string('./authentication/password_reset_email.html', {
            'user': user,
            'reset_link': reset_link
        })
        # Generate the plain text version by stripping HTML tags
        text_content = strip_tags(email_body)

        # Create the email message object
        email_subject = 'Password Reset'
        email = EmailMultiAlternatives(email_subject, text_content, settings.EMAIL_HOST_USER, [email])

        # Attach the HTML content
        email.attach_alternative(email_body, "text/html")

        # Send the email
        email.send(fail_silently=False)

        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    
    def post(self, request, uidb64, token):
        print("Received uidb64:", uidb64)
        print("Received token:", token)
        
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                print("Decoded uid:", uid)
                user = User.objects.get(pk=uid)
                print("Retrieved user:", user,"\npk =",user.pk)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                print("except")
                user = None
            if user is not None and custom_token_generator.check_token(user, token):
                new_password = serializer.validated_data.get('new_password')
                user.password= make_password(new_password)
                user.save()
                return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
