from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.timezone import now

class Temp(models.Model):
    userid = models.IntegerField(primary_key=True,unique=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=False)
    password = models.CharField(max_length=255)
    vericode = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'temp'
        
class User(AbstractBaseUser, PermissionsMixin):
    userid = models.IntegerField(primary_key=True, unique=True)
    username = models.CharField(max_length=255,unique=True)
    email = models.EmailField(unique=False)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=255,default='user')
    is_active = models.BooleanField(default=False)
    food_type = models.CharField(max_length=255, default='')
    preference = models.TextField(default='')
    first_name = ''
    last_name = ''
    is_superuser = False
    last_login = None
    date_joined = ''
    is_staff = False

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'

class Feedback(models.Model):
    id = models.AutoField(primary_key=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userid')
    category = models.CharField(max_length=255)
    feedback = models.TextField()
    feedback_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'feedbacks'