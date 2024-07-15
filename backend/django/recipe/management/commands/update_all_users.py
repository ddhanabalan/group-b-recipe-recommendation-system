# recipe/management/commands/update_all_users.py
import os
import pandas as pd
import pickle
from django.conf import settings
from django.core.management.base import BaseCommand
from recipe.models import Reviews

class Command(BaseCommand):
    help = 'Update the all_users.pkl file with the latest data from the reviews table.'

    def handle(self, *args, **kwargs):
        # Define file paths
        pickle_file_path = os.path.join(settings.BASE_DIR, 'AIML', 'all_users.pkl')
        # pickle_file_path = os.path.join(settings.ML_DIR, 'AIML','all_users.pkl')

        # Field mapping from reviews table to CSV
        field_mapping = {
            'review_date': 'date',
            'rating': 'rating',
            'recipeid': 'recipe_id',
            'review': 'review',
            'userid': 'user_id',
            'username': 'username'
        }

        # Load the existing file
        if os.path.exists(pickle_file_path):
            with open(pickle_file_path, 'rb') as file:
                df = pickle.load(file)
        else:
            df = pd.DataFrame(columns=field_mapping.values())

        # Fetch new data using Django ORM
        new_data = Reviews.objects.all().values()
        new_data_df = pd.DataFrame(list(new_data))

        # Rename columns according to the field mapping
        new_data_df = new_data_df.rename(columns=field_mapping)

        # Ensure new_data_df contains only the columns present in the CSV
        new_data_df = new_data_df[df.columns.intersection(new_data_df.columns)]

        # Append new data to the existing DataFrame
        updated_df = pd.concat([df, new_data_df]).drop_duplicates().reset_index(drop=True)

        # Also save the updated DataFrame to a pickle file
        with open(pickle_file_path, 'wb') as file:
            pickle.dump(updated_df, file)

        self.stdout.write(self.style.SUCCESS('Successfully updated the all_users.pkl file.'))
