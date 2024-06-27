from celery import shared_task
from django.core.management import call_command

@shared_task
def update_recommendation_model_task():
    try:
        call_command('update_all_users')
        call_command('update_all_recipes')  
        call_command('update_user_clicks') 
        call_command('update_user_save') 
    except Exception as e:
        # Handle exceptions if needed
        print(f"Error occurred: {e}")