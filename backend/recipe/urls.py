from django.urls import path
from recipe.views import AllRecipes,PopularRecipes,NewRecipes, AddFavorite, AllFavourites, RecipeReviews, AllReviews

urlpatterns = [
    path('allrecipes/', AllRecipes.as_view(), name='allrecipes'),
    path('popularrecipes/', PopularRecipes.as_view(), name='popularrecipes'),
    path('newrecipes/', NewRecipes.as_view(), name='newrecipes'),
    path('saverecipe/', AddFavorite.as_view(), name='saverecipes'),
    path('saved/', AllFavourites.as_view(), name='saved'),
    path('recipereview/', RecipeReviews.as_view(), name='recipereview'),
    path('allreviews/', AllReviews.as_view(), name='allreview'),
]
