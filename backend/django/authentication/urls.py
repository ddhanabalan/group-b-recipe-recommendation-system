from django.urls import path
from authentication.views import UserSignup, UserLogin, ForgotPassword, VerifyEmail, Logout, PasswordResetConfirmView, DeleteUser
from authentication.views import ChangeUsername, FetchUsernameAndEmail, AddFeedback, DeleteFeedback, AllUsersLimited, UsersCount
from authentication.views import FeedbackCount, AllFeedbacksLimited, NewUsersLast30Days, ChangePassword, NewUsersLast30DaysDetails
from authentication.views import AddPreference, AddFoodType, FetchUserPreference
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/', UserSignup.as_view(), name='signup'),
    path('login/', UserLogin.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgot-password/', ForgotPassword.as_view(), name='forgot_password'),
    path('reset/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-email/', VerifyEmail.as_view(), name='verify_email'),
    path('logout/', Logout.as_view(), name='logout'),
    path('change-username/', ChangeUsername.as_view(), name='change-username'),
    path('change-password/', ChangePassword.as_view(), name='change-password'),
    path('userdetails/', FetchUsernameAndEmail.as_view(), name='userdetails'),
    path('addfeedback/', AddFeedback.as_view(), name='addfeedback'),
    path('deletefeedback/', DeleteFeedback.as_view(), name='deletefeedback'),
    path('allfeedbacklimited/', AllFeedbacksLimited.as_view(), name='allfeedbacklimited'),
    path('alluserslimited/', AllUsersLimited.as_view(), name='alluserslimited'),
    path('userscount/', UsersCount.as_view(), name='userscount'),
    path('feedbackcount/', FeedbackCount.as_view(), name='feedbackcount'),
    path('deleteuser/', DeleteUser.as_view(), name='deleteuser'),
    path('newuserscount/', NewUsersLast30Days.as_view(), name='newuserscount'),
    path('newusersdetails/', NewUsersLast30DaysDetails.as_view(), name='newusersdetails'),
    path('addpreference/', AddPreference.as_view(), name='addpreference'),
    path('addfoodtype/', AddFoodType.as_view(), name='addfoodtype'),
    path('userpreferences/', FetchUserPreference.as_view(), name='fetchuserpreference'),
]