import os
import pandas as pd
import pickle
from django.conf import settings
from django.core.management.base import BaseCommand
from recipe.models import Favorite

class Command(BaseCommand):
    help = 'Update the user_save.pkl file with the latest data from the database.'

    def handle(self, *args, **kwargs):
        # Define the file path for the pickle file
        pickle_file_path = os.path.join(settings.BASE_DIR, 'AIML', 'user_save.pkl')
        # pickle_file_path = os.path.join(settings.ML_DIR, 'AIML', 'user_save.pkl')

        # Fetch new data using Django ORM
        favourites = Favorite.objects.all()

        if not favourites.exists():
            self.stdout.write(self.style.WARNING('No data found in the favourites table. Creating an empty user_save.pkl file.'))
            new_data_df = pd.DataFrame(columns=['recipe_id', 'user_id', 'saved'])
        else:
            new_data = []
            for favourite in favourites:
                new_data.append({
                    'recipe_id': favourite.recipeid.recipeid,
                    'user_id': favourite.userid.userid,
                    'saved': 1  # All entries in the favourites table are saved, so this is always 1
                })
            new_data_df = pd.DataFrame(new_data)

        # Log DataFrame structure and content
        # self.stdout.write(self.style.SUCCESS(f'DataFrame structure: {new_data_df.columns.tolist()}'))
        # self.stdout.write(self.style.SUCCESS(f'First few rows of DataFrame:\n{new_data_df.head()}'))

        # Save the DataFrame to a pickle file
        with open(pickle_file_path, 'wb') as file:
            pickle.dump(new_data_df, file)

        self.stdout.write(self.style.SUCCESS('Successfully updated the user_save.pkl file.'))
