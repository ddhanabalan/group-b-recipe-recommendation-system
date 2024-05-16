from django.urls import path
from authentication.views import UserSignup, UserLogin, ForgotPassword, VerifyEmail, Logout, PasswordResetConfirmView
from authentication.views import ChangeUsername, FetchUsernameAndEmail, AddFeedback, DeleteFeedback, AllUsersLimited
from authentication.views import UsersCount, FeedbackCount, AllFeedbacksLimited, DeleteUser
#from .views import PasswordResetConfirmView

urlpatterns = [
    path('signup/', UserSignup.as_view(), name='signup'),
    path('login/', UserLogin.as_view(), name='login'),
    path('forgot-password/', ForgotPassword.as_view(), name='forgot_password'),
    path('reset/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-email/', VerifyEmail.as_view(), name='verify_email'),
    path('logout/', Logout.as_view(), name='logout'),
    path('change-username/', ChangeUsername.as_view(), name='change-username'),
    path('userdetails/', FetchUsernameAndEmail.as_view(), name='userdetails'),
    path('addfeedback/', AddFeedback.as_view(), name='addfeedback'),
    path('deletefeedback/', DeleteFeedback.as_view(), name='deletefeedback'),
    path('allfeedbacklimited/', AllFeedbacksLimited.as_view(), name='allfeedbacklimited'),
    path('alluserslimited/', AllUsersLimited.as_view(), name='alluserslimited'),
    path('userscount/', UsersCount.as_view(), name='userscount'),
    path('feedbackcount/', FeedbackCount.as_view(), name='feedbackcount'),
    path('deleteuser/', DeleteUser.as_view(), name='deleteuser'),
]