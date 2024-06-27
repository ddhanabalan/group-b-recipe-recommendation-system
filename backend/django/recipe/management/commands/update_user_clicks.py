import os
import pandas as pd
import pickle
from django.conf import settings
from django.core.management.base import BaseCommand
from recipe.models import History

class Command(BaseCommand):
    help = 'Update the user_clicks.pkl file with the latest data from the database.'

    def handle(self, *args, **kwargs):
        # Define file paths
        csv_file_path = os.path.join(settings.BASE_DIR, 'AIML', 'all_clicks.csv')
        pickle_file_path = os.path.join(settings.BASE_DIR, 'AIML', 'user_clicks.pkl')
        # csv_file_path = os.path.join(settings.ML_DIR, 'AIML', 'all_clicks.csv')
        # pickle_file_path = os.path.join(settings.ML_DIR, 'AIML', 'user_click.pkl')

        # Fetch new data using Django ORM
        user_history = History.objects.all()

        if not user_history.exists():
            self.stdout.write(self.style.WARNING('No data found in the history table. Creating an empty user_click.pkl file.'))
            new_data_df = pd.DataFrame(columns=['recipe_id', 'user_id', 'click'])
        else:
            new_data = []
            
            for history in user_history:
                new_data.append({
                    'recipe_id': history.recipeid,
                    'user_id': history.userid,
                    'click': history.total_count  # Assuming total_count represents clicks
                })

            new_data_df = pd.DataFrame(new_data)

        # Save the DataFrame to a CSV file
        try:
            new_data_df.to_csv(csv_file_path, index=False)
        except PermissionError as e:
            raise PermissionError(f"Cannot write to {csv_file_path}. Check file permissions.") from e

        # Also save the DataFrame to a pickle file in CSV format
        try:
            with open(pickle_file_path, 'wb') as file:
                pickle.dump(new_data_df, file)
        except PermissionError as e:
            raise PermissionError(f"Cannot write to {pickle_file_path}. Check file permissions.") from e

        self.stdout.write(self.style.SUCCESS('Successfully updated the user_clicks.pkl file.'))
