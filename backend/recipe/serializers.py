from rest_framework import serializers
from .models import Recipe, Category, RecipeCategories, Favorite, Reviews
from authentication.models import User

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
    
class FavoriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Favorite
        fields = ['userid', 'recipeid']

    def create(self, validated_data):
        """
        Override the create method to handle the saving of the favorite
        """
        return Favorite.objects.create(**validated_data)
    
class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = ['id','recipeid','userid','username','review','review_date']

        