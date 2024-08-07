from rest_framework import serializers
from .models import Recipe, Category, RecipeCategories, Favorite, Reviews, History, Image, Video, SearchHistory
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
        fields = ['recipeid', 'userid', 'title', 'ingredients', 'img', 'video', 'thumbnail', 'calories', 'rating', 'total_reviews', 'season', 'daytimeofcooking', 'veg_nonveg', 'total_mins', 'created_at']

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
        fields = ['recipeid', 'title', 'userid', 'ingredients', 'img', 'video', 'thumbnail', 'calories', 'season', 'daytimeofcooking', 'veg_nonveg', 'total_mins', 'categories']

class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = History
        fields = ['userid', 'recipeid']

    def create(self, validated_data):
        """
        Override the create method to handle the saving of the favorite
        """
        return History.objects.create(**validated_data)
    
class SearchHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SearchHistory
        fields = ['userid', 'search_text']

    def create(self, validated_data):
        """
        Override the create method to handle the saving of the favorite
        """
        return SearchHistory.objects.create(**validated_data)

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image', 'uploaded_at', 'image_url']
        read_only_fields = ['image_url']

class VideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Video
        fields = ['id', 'video', 'uploaded_at', 'video_url']
        read_only_fields = ['video_url']

class FetchHistorySerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    img = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ['id', 'userid', 'recipeid', 'added_at', 'title', 'img']

    def get_title(self, obj):
        return obj.recipeid.title if obj.recipeid else None

    def get_img(self, obj):
        return obj.recipeid.img if obj.recipeid else None