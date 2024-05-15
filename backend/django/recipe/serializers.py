from rest_framework import serializers
from .models import Recipe, Category, RecipeCategories, Favorite, Reviews, History
#from authentication.models import User
from datetime import date

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

class TitleSerializer(serializers.ModelSerializer):
    # categories = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['recipeid',  'title']

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
        fields = ['id','recipeid','userid','username','review','rating']
    def create(self, validated_data):
        # Automatically set the review_date to the current date
        validated_data['review_date'] = date.today()
        return super().create(validated_data)

class RecipeWithCategoriesSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(child=serializers.CharField())


    class Meta:
        model = Recipe
        fields = ['recipeid', 'title', 'userid', 'ingredients', 'img', 'calories', 'season', 'daytimeofcooking', 'veg_nonveg', 'total_mins', 'categories']

class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = History
        fields = ['userid', 'recipeid']

    def create(self, validated_data):
        """
        Override the create method to handle the saving of the favorite
        """
        return History.objects.create(**validated_data)
        