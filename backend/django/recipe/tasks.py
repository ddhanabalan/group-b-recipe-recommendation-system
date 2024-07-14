from celery import shared_task
from django.core.management import call_command
from django.utils import autoreload
import os
from django.conf import settings

@shared_task
def update_recommendation_model_task():
    try:
        call_command('update_all_users')
        call_command('update_all_recipes')  
        call_command('update_user_clicks') 
        call_command('update_user_save') 
        
        touch_file = os.path.join(settings.BASE_DIR, 'recommend', 'views.py')
        with open(touch_file, 'a'):
            os.utime(touch_file, None)
        
        return "Completed"

    except Exception as e:
        # Handle exceptions if needed
        print(f"Error occurred: {e}")