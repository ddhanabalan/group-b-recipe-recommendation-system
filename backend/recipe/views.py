from rest_framework import generics
from rest_framework.response import Response
from .models import Recipe, Category, RecipeCategories
from .serializers import RecipeSerializer

class RecipeListView(generics.ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        print(queryset)
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        print(data)
        # Fetching categories for each recipe and adding them to the response
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        print(data)
        return Response(data)