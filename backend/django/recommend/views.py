from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg
import pickle
import os
from recipe.models import Recipe, Category
from recipe.serializers import RecipeSerializer, RecipeCategories
from django.conf import settings
import random
from .models import Recommendation, RecommendedRecipes
from datetime import date

# Custom Unpickler to ensure recommend_recipe is available
class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "__main__":
            module = "AIML.RecipeRecommendationSystem"
        return super().find_class(module, name)


class RecipePrediction(APIView):
    # Load the model
    model_path = os.path.join(settings.BASE_DIR, 'AIML', 'KNN_model.pkl')
    # model_path = os.path.join(settings.ML_DIR, 'AIML', 'KNN_model.pkl')
    # model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'AIML', 'KNN_model.pkl')
    with open(model_path, 'rb') as f:
        model = CustomUnpickler(f).load()
    def post(self, request, *args, **kwargs):
        data = request.data.get('recipeid')
        if not data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Make prediction
        prediction = RecipePrediction.model(int(data))
        queryset = Recipe.objects.filter(recipeid__in=prediction)
        serializer = RecipeSerializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        
        return Response(data, status=status.HTTP_200_OK)
    
class UserPrediction(APIView):
    # Load the model
    model_path = os.path.join(settings.BASE_DIR, 'AIML', 'CF_model_renewed.pkl')
    # model_path = os.path.join(settings.ML_DIR, 'AIML', 'CF_model_renewed.pkl')
    # model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'AIML', 'CF_model.pkl')
    with open(model_path, 'rb') as f:
        model = CustomUnpickler(f).load()
    def post(self, request, *args, **kwargs):
        data = request.data.get('userid')
        if not data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        today = date.today()
        try:
            recommendation = Recommendation.objects.get(userid=data, date=today)
            recommended_recipes = recommendation.recipes.all()
            prediction = [rec.recipeid.recipeid for rec in recommended_recipes]  # Access recipeid as foreign key
        except Recommendation.DoesNotExist:
            # Make prediction
            prediction = UserPrediction.model(int(data))
            if len(prediction)==0:
                avg_review = Recipe.objects.aggregate(Avg("total_reviews"))
                avg_total_reviews = avg_review['total_reviews__avg']
                top_recipes = list(Recipe.objects.filter(total_reviews__gte=avg_total_reviews).values_list('recipeid', flat=True).order_by('-rating')[:50])
                # Randomly select 10 recipes from the top 50
                if len(top_recipes) > 10:
                    prediction = random.sample(top_recipes, 10)
                else:
                    prediction = top_recipes
            # Save the new recommendation
            recommendation = Recommendation.objects.create(userid_id=data)
            for recipe_id in prediction:
                RecommendedRecipes.objects.create(recmd_id=recommendation, recipeid_id=recipe_id)
        queryset = Recipe.objects.filter(recipeid__in=prediction)
        serializer = RecipeSerializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        
        return Response(data, status=status.HTTP_200_OK)

