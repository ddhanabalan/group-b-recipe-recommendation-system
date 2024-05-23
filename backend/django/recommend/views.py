from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg
import pickle
import os
from recipe.models import Recipe, Category
from recipe.serializers import RecipeSerializer, RecipeCategories
from django.conf import settings

# Custom Unpickler to ensure recommend_recipe is available
class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "__main__":
            module = "AIML.RecipeRecommendationSystem"
        return super().find_class(module, name)


class RecipePrediction(APIView):
    # Load the model
    model_path = os.path.join(settings.BASE_DIR, 'AIML', 'KNN_model.pkl')
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
    model_path = os.path.join(settings.BASE_DIR, 'AIML', 'CF_model.pkl')
    # model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'AIML', 'CF_model.pkl')
    with open(model_path, 'rb') as f:
        model = CustomUnpickler(f).load()
    def post(self, request, *args, **kwargs):
        data = request.data.get('userid')
        if not data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Make prediction
        prediction = UserPrediction.model(int(data))
        print(prediction)
        if len(prediction)==0:
            avg_review = Recipe.objects.aggregate(Avg("total_reviews"))
            print(avg_review)
            avg_total_reviews = avg_review['total_reviews__avg']
            print(avg_total_reviews)
            prediction = list(Recipe.objects.filter(total_reviews__gte=avg_total_reviews).values_list('recipeid', flat=True).order_by('-rating')[:10])
            print(prediction)
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
