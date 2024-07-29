import os
import pickle
import pandas as pd
from django.conf import settings
from django.core.management.base import BaseCommand
from recipe.models import Recipe, RecipeCategories, Category

class Command(BaseCommand):
    help = 'Update the all_recipes.pkl file with the latest data from the database.'

    def handle(self, *args, **kwargs):
        # Define file paths
        pickle_file_path = os.path.join(settings.BASE_DIR, 'AIML', 'all_recipes.pkl')
        # pickle_file_path = os.path.join(settings.ML_DIR, 'AIML', 'all_recipes.pkl')

        # Field mapping from recipe table to DataFrame columns
        field_mapping = {
            'calories': 'calories',
            'ratings': 'ratings',
            'recipe_id': 'recipe_id',
            'reviews': 'reviews',
            'title': 'title',
            'total_mins': 'total_mins',
            'season': 'Season',
            'daytimeofcooking': 'DaytimeOfCooking',
            'veg_nonveg': 'Veg/NonVeg'
        }

        # Fetch new data using Django ORM
        recipes = Recipe.objects.all()
        new_data = []

        for recipe in recipes:
            categories = RecipeCategories.objects.filter(recipeid=recipe.recipeid).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)

            new_data.append({
                'calories': recipe.calories if recipe.calories is not None else 0,
                'category': list(category_names),
                'ingredients': recipe.ingredients.split('\n') if recipe.ingredients else [],
                'ratings': recipe.rating if recipe.rating is not None else -1,
                'recipe_id': recipe.recipeid,
                'reviews': recipe.total_reviews if recipe.total_reviews is not None else 0,
                'title': recipe.title,
                'total_mins': recipe.total_mins if recipe.total_mins is not None else 0,
                'season': recipe.season if recipe.season else 'Unknown',
                'daytimeofcooking': recipe.daytimeofcooking if recipe.daytimeofcooking else 'Unknown',
                'veg_nonveg': recipe.veg_nonveg if recipe.veg_nonveg else 'Unknown'
            })

        new_data_df = pd.DataFrame(new_data)

        # Rename columns according to the field mapping
        new_data_df = new_data_df.rename(columns=field_mapping)

        # Convert columns containing lists to strings
        columns_to_string = ['category', 'ingredients']
        for col in columns_to_string:
            new_data_df[col] = new_data_df[col].apply(lambda x: '|'.join(x) if isinstance(x, list) else x)

        # Ensure DataFrame has the correct structure and data types

        # Save the updated DataFrame to a pickle file
        try:
            with open(pickle_file_path, 'wb') as file:
                pickle.dump(new_data_df, file)
        except PermissionError as e:
            raise PermissionError(f"Cannot write to {pickle_file_path}. Check file permissions.") from e

        self.stdout.write(self.style.SUCCESS('Successfully updated the all_recipes.pkl file.'))
