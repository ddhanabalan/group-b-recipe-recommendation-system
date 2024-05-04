from rest_framework import serializers
from .models import Recipe, Category, RecipeCategories

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class RecipeCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeCategories
        fields = ['recipeid', 'category_id']

class RecipeSerializer(serializers.ModelSerializer):
    # categories = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['recipeid', 'userid', 'title', 'ingredients', 'img', 'calories', 'rating', 'total_reviews', 'season', 'daytimeofcooking', 'veg_nonveg', 'total_mins', 'created_at']#, 'categories']
        