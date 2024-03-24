from django.urls import path
from authentication.views import UserSignup, UserLogin, ForgotPassword
from authentication.views import PasswordResetConfirmView
#from .views import PasswordResetConfirmView

urlpatterns = [
    path('signup/', UserSignup.as_view(), name='signup'),
    path('login/', UserLogin.as_view(), name='login'),
    path('forgot-password/', ForgotPassword.as_view(), name='forgot_password'),
    path('reset/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]