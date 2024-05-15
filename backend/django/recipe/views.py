from rest_framework import generics,status
from rest_framework.response import Response
from .models import Recipe, Category, RecipeCategories, Favorite, Reviews, History
from .serializers import RecipeSerializer, FavoriteSerializer, ReviewsSerializer, TitleSerializer, RecipeWithCategoriesSerializer, CategorySerializer, HistorySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
import random
import string

class AllRecipes(generics.ListAPIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        return Response(data)

class PopularRecipes(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.order_by("-total_reviews")[:10]
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        return Response(data)
    
class NewRecipes(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.order_by("-created_at")[:10]
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = RecipeSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        return Response(data)

class AddFavorite(APIView):
    #permission_classes = [IsAuthenticated]

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
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('userid')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Favorite.objects.filter(userid=user_id)
        recipe_ids = list(queryset.values_list('recipeid', flat=True))
        recipes = Recipe.objects.filter(recipeid__in=recipe_ids)
        serializer = RecipeSerializer(recipes, many=True)

        data = serializer.data
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)

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
    

class AllReviews(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Reviews.objects.all()
    serializer_class = ReviewsSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ReviewsSerializer(queryset, many=True)
        data = serializer.data
        
        return Response(data)

class AddReview(generics.CreateAPIView):
    # permission_classes = [IsAuthenticated]
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
        for recipe_data in data:
            recipe_id = recipe_data['recipeid']
            categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
            category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
            recipe_data['categories'] = list(category_names)
        return Response(data)

class UserHistory(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = HistorySerializer(data=request.data)
        if serializer.is_valid():
            recipe_id = serializer.validated_data.get('recipeid')
            user_id = serializer.validated_data.get('userid')
            # Check if the favorite already exists
            if History.objects.filter(userid=user_id, recipeid=recipe_id).exists():
                return Response({'error': 'History already saved'}, status=status.HTTP_400_BAD_REQUEST)
            # Save the favorite
            serializer.save(userid=user_id, recipeid=recipe_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)