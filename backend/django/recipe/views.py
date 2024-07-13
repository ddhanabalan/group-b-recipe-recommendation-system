from rest_framework import generics, status
from rest_framework.response import Response
from .models import Recipe, Category, RecipeCategories, Favorite, Reviews, History, SearchHistory
from .serializers import RecipeSerializer, FavoriteSerializer, ReviewsSerializer, TitleSerializer, FetchHistorySerializer, SearchHistorySerializer
from .serializers import RecipeWithCategoriesSerializer, CategorySerializer, HistorySerializer, ImageSerializer, VideoSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
import random
import string
from django.utils import timezone
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

def AddCategories(data):
    for recipe_data in data:
        recipe_id = recipe_data['recipeid']
        categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
        category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
        recipe_data['categories'] = list(category_names)
    return data

class AllRecipes(generics.ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data = AddCategories(data)
        return Response(data)

class AllRecipesLimited(APIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer

    def post(self, request, *args, **kwargs):
        limit = int(request.data.get('page'))
        queryset = Recipe.objects.all().order_by('-created_at')[((limit-1)*20):(limit*20)]
        serializer = RecipeSerializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data = AddCategories(data)
        
        return Response(data)

class PopularRecipes(generics.ListAPIView):

    def list(self, request, *args, **kwargs):
        start_date = timezone.now() - timedelta(days=30)
        queryset = Recipe.objects.filter(created_at__gte=start_date).order_by("-total_reviews")[:10]
        while len(queryset)<5:
            start_date = start_date - timedelta(days=30)
            queryset = Recipe.objects.filter(created_at__gte=start_date).order_by("-total_reviews")[:10]
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data = AddCategories(data)
        return Response(data)
    
class NewRecipes(generics.ListAPIView):
    queryset = Recipe.objects.order_by("-created_at")[:10]
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data = AddCategories(data)
        return Response(data)

class AddFavorite(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            recipe_id = serializer.validated_data.get('recipeid')
            user_id = serializer.validated_data.get('userid')
            # Check if the favorite already exists
            if Favorite.objects.filter(userid=user_id, recipeid=recipe_id).exists():
                return Response({'error': 'Recipe already favorited'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the favorite
            serializer.save(userid=user_id, recipeid=recipe_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RemoveFavourites(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userid')
        recipe_id=request.data.get('recipeid')
        if not user_id or not recipe_id:
            return Response({'error': 'userid and recipeid are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            favorite = Favorite.objects.filter(userid=user_id, recipeid=recipe_id)
            favorite.delete()
            return Response({'message': 'Favorite removed successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found'}, status=status.HTTP_404_NOT_FOUND)

class AllFavourites(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userid')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Favorite.objects.filter(userid=user_id)
        recipe_ids = list(queryset.values_list('recipeid', flat=True))
        recipes = Recipe.objects.filter(recipeid__in=recipe_ids)
        serializer = RecipeSerializer(recipes, many=True)

        data = serializer.data
        data = AddCategories(data)

        return Response(data)
    
class RecipeReviews(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipeid')
        if not recipe_id:
            return Response({'error': 'Recipe ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Reviews.objects.filter(recipeid=recipe_id)
        serializer = ReviewsSerializer(queryset, many=True)
        data = serializer.data

        return Response(data)
    
class RecipeReviewsLimited(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipeid')
        limit = int(request.data.get('page'))
        if not recipe_id:
            return Response({'error': 'Recipe ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Reviews.objects.filter(recipeid=recipe_id)[((limit-1)*10):(limit*10)]
        serializer = ReviewsSerializer(queryset, many=True)
        data = serializer.data

        return Response(data)

class AllReviews(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Reviews.objects.all()
    serializer_class = ReviewsSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ReviewsSerializer(queryset, many=True)
        data = serializer.data
        
        return Response(data)

class AllReviewsLimited(APIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = ReviewsSerializer

    def post(self, request, *args, **kwargs):
        limit = int(request.data.get('page'))
        queryset = Reviews.objects.all().order_by('-review_date')[((limit-1)*30):(limit*30)]
        serializer = ReviewsSerializer(queryset, many=True)
        data = serializer.data
        
        return Response(data)

class AddReview(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewsSerializer

    def post(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipeid')
        rating = request.data.get('rating')
        serializer = ReviewsSerializer(data=request.data)
        #serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            recipe = Recipe.objects.get(pk=recipe_id)
            # Calculate the new average rating
            new_total_reviews = recipe.total_reviews + 1
            new_rating = ((recipe.rating * recipe.total_reviews) + float(rating)) / new_total_reviews
            
            # Update the recipe with new total_reviews and new_rating
            recipe.total_reviews = new_total_reviews
            recipe.rating = new_rating
            recipe.save()
            # recipe.total_reviews += 1
            # recipe.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteReview(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        # Extract the ID from the request data
        review_id = request.data.get('id')

        try:
            # Get the review object
            review = Reviews.objects.get(pk=review_id)
            recipe_id = review.recipeid_id 
            rating = review.rating
        except Reviews.DoesNotExist:
            return Response({"message": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the review object
        review.delete()

        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            new_total_reviews = recipe.total_reviews - 1
            new_rating = ((recipe.rating * recipe.total_reviews) - float(rating)) / new_total_reviews

            recipe.total_reviews = new_total_reviews
            recipe.rating = new_rating
            recipe.save()

            return Response({"message": "Review deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Recipe.DoesNotExist:
            # If the corresponding recipe does not exist, return a 404 response
            return Response({"message": "Associated recipe not found"}, status=status.HTTP_404_NOT_FOUND)
            
class AllTitles(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.values('recipeid','title')
    serializer_class = TitleSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = TitleSerializer(queryset, many=True)
        data = serializer.data
        
        return Response(data)

def generate_unique_userid():
    while True:
        recipeid = ''.join(random.choices(string.digits, k=8))
        if not Recipe.objects.filter(recipeid=recipeid).exists():
            return recipeid

class AddRecipe(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeWithCategoriesSerializer

    def post(self, request, *args, **kwargs):
        title = request.data.get('title')
        if not Recipe.objects.filter(title=title).exists():
            recipeid = generate_unique_userid()
            serializer = RecipeWithCategoriesSerializer(data={**request.data, 'recipeid': recipeid})
            if serializer.is_valid():
                recipe_data = serializer.validated_data
                categories_data = recipe_data.pop('categories')
                # Create the recipe
                recipe = Recipe.objects.create(**recipe_data)
                # Create categories for the recipe
                for category in categories_data:
                    recipe_id = Recipe.objects.get(recipeid=recipeid)
                    category_obj = Category.objects.filter(name=category).first()
                    if category_obj:
                        RecipeCategories.objects.create(recipeid=recipe_id, category_id=category_obj.id)
                return Response({"message": "Recipe added successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Recipe with this title already exists"}, status=status.HTTP_400_BAD_REQUEST)

class DeleteRecipe(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def delete(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipeid')
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            recipe.delete()
            return Response({"message": "Recipe deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Recipe.DoesNotExist:
            return Response({"message": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

class AllCategories(generics.ListAPIView):
    queryset = Category.objects.values('name')
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = CategorySerializer(queryset, many=True)
        data = serializer.data
        return Response(data)
    
class UserRecipes(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userid')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Recipe.objects.filter(userid=user_id)
        serializer = RecipeSerializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data = AddCategories(data)
        return Response(data)

class UserHistory(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = HistorySerializer(data=request.data)
        if serializer.is_valid():
            recipe_id = serializer.validated_data.get('recipeid')
            user_id = serializer.validated_data.get('userid')
            # Check if the history already exists
            if History.objects.filter(userid=user_id, recipeid=recipe_id).exists():
                history = History.objects.get(userid=user_id, recipeid=recipe_id)
                history.total_count+=1
                history.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            # Save the history
            serializer.save(userid=user_id, recipeid=recipe_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserSearchHistory(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SearchHistorySerializer(data=request.data)
        if serializer.is_valid():
            searchtext = serializer.validated_data.get('search_text')
            user_id = serializer.validated_data.get('userid')
            # Check if the search history already exists
            if SearchHistory.objects.filter(userid=user_id, search_text=searchtext).exists():
                history = SearchHistory.objects.get(userid=user_id, search_text=searchtext)
                history.total_count+=1
                history.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            # Save the search history
            serializer.save(userid=user_id, search_text=searchtext)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecipesCount(APIView):

    def get(self, request, *args, **kwargs):
        count = Recipe.objects.count()
        return Response(count)

class ReviewsCount(APIView):

    def get(self, request, *args, **kwargs):
        count = Reviews.objects.count()
        return Response(count)

class NewRecipesLast30Days(APIView):

    def get(self, request, *args, **kwargs):
        start_date = timezone.now() - timedelta(days=30)
        # Filter recipes created in the last 30 days
        new_recipes = Recipe.objects.filter(created_at__gte=start_date).count()
        return Response(new_recipes)

class NewRecipesLast30DaysDetails(APIView):      
    serializer_class = RecipeSerializer

    def post(self, request, *args, **kwargs):
        limit = int(request.data.get('page'))
        start_date = timezone.now() - timedelta(days=30)
        queryset = Recipe.objects.filter(created_at__gte=start_date).order_by('-created_at')[((limit-1)*20):(limit*20)]
        serializer = RecipeSerializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data = AddCategories(data)
        
        return Response(data)
    
# class ImageUploadView(APIView):
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, *args, **kwargs):
#         serializer = ImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data['image_url'], status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MediaUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        if 'image' in request.data:
            serializer = ImageSerializer(data=request.data)
        elif 'video' in request.data:
            serializer = VideoSerializer(data=request.data)
        else:
            return Response({"error": "No media file provided."}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            media_url = serializer.data.get('image_url') or serializer.data.get('video_url')
            return Response(media_url, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FetchUserHistory(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userid')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = History.objects.filter(userid=user_id).select_related('recipeid').order_by('-added_at')
        serializer = FetchHistorySerializer(queryset, many=True)
        data = serializer.data
        
        return Response(data)
    
class DeleteHistory(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        history_id = request.data.get('id')
        try:
            history = History.objects.get(pk=history_id)
            history.delete()
            return Response({"message": "History deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except History.DoesNotExist:
            return Response({"message": "History not found"}, status=status.HTTP_404_NOT_FOUND)
        
class DeleteAllHistory(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user_id = request.data.get('userid')
        try:
            history = History.objects.filter(userid=user_id)
            history.delete()
            return Response({"message": "History deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except History.DoesNotExist:
            return Response({"message": "History not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SingleRecipe(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipeid')
        if not recipe_id:
            return Response({'error': 'Recipe ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            recipe = Recipe.objects.get(recipeid=recipe_id)
        except:
            return Response({"message": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = RecipeSerializer(recipe)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        data=[data]
        data = AddCategories(data)
        return Response(data[0])
    
class EditRecipe(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipeid = request.data.get('recipeid')
        if not recipeid:
            return Response({"message": "Recipe ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            recipe = Recipe.objects.get(recipeid=recipeid)
        except Recipe.DoesNotExist:
            return Response({"message": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

        # Make a mutable copy of request.data
        data = request.data.copy()
        
        # Extract categories from mutable copy of request data
        categories_data = data.pop('categories', None)

        serializer = RecipeSerializer(recipe, data=data, partial=True)
        if serializer.is_valid():
            # Save the updated recipe data
            serializer.save()

            if categories_data is not None:
                # Clear existing categories
                RecipeCategories.objects.filter(recipeid=recipe).delete()

                for category in categories_data:
                    category_obj = Category.objects.filter(name=category).first()
                    if category_obj:
                        RecipeCategories.objects.create(recipeid=recipe, category_id=category_obj.id)

            return Response({"message": "Recipe updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MadeRecipe(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        recipeid = request.data.get('recipeid')
        
        # Ensure userid and recipeid are provided
        if not recipeid:
            return Response({'error': 'Recipe Id are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        history = get_object_or_404(History, userid=user.userid, recipeid=recipeid)
        history.status = True
        history.save()  # Save the updated status
        
        return Response({'success': 'Status updated successfully.'}, status=status.HTTP_200_OK)

