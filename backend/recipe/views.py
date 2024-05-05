from rest_framework import generics,status
from rest_framework.response import Response
from .models import Recipe, Category, RecipeCategories, Favorite, Reviews
from .serializers import RecipeSerializer, FavoriteSerializer, ReviewsSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class AllRecipes(generics.ListAPIView):
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

    def post(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipeid')
        if not recipe_id:
            return Response({'error': 'Recipe ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        #print(recipe_id)
        queryset = Reviews.objects.filter(recipeid=recipe_id)
        #print(queryset)
        serializer = ReviewsSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        return Response(data)
    
# class RecipeReviews(generics.ListAPIView):
#     # permission_classes = [IsAuthenticated]
#     queryset = Reviews.objects.filter(recipeid=recipe_id)
#     serializer_class = RecipeSerializer

#     def post(self, request, *args, **kwargs):
#         recipe_id = request.data.get('recipeid')
#         if not recipe_id:
#             return Response({'error': 'Recipe ID is required'}, status=status.HTTP_400_BAD_REQUEST)
#         queryset = self.get_queryset()
#         serializer = RecipeSerializer(queryset, many=True)
#         # serializer = self.get_serializer(queryset, many=True)
#         data = serializer.data
#         # Fetching categories for each recipe and adding them to the response
#         for recipe_data in data:
#             recipe_id = recipe_data['recipeid']
#             categories = RecipeCategories.objects.filter(recipeid=recipe_id).values_list('category_id', flat=True)
#             category_names = Category.objects.filter(id__in=categories).values_list('name', flat=True)
#             recipe_data['categories'] = list(category_names)
#         return Response(data)

class AllReviews(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Reviews.objects.all()
    serializer_class = RecipeSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ReviewsSerializer(queryset, many=True)
        # serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        # Fetching categories for each recipe and adding them to the response
        
        return Response(data)