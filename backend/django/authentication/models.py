from django.db import models

class Temp(models.Model):
    userid = models.IntegerField(primary_key=True,unique=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=False)
    password = models.CharField(max_length=255)
    vericode = models.CharField(max_length=255)
    class Meta:
        db_table = 'temp'
        
class User(models.Model):
    userid = models.IntegerField(primary_key=True, unique=True)
    username = models.CharField(max_length=255,unique=True)
    email = models.EmailField(unique=False)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=255,default='user')
    is_active = models.BooleanField(default=False)
    
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