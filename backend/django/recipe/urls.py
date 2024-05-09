from django.urls import path
from recipe.views import AllRecipes,PopularRecipes,NewRecipes, AddFavorite, AllFavourites, RecipeReviews, AllReviews, AllTitles, AddReview, DeleteReview,AddRecipe, AllCategories, UserRecipes

urlpatterns = [
    path('allrecipes/', AllRecipes.as_view(), name='allrecipes'),
    path('popularrecipes/', PopularRecipes.as_view(), name='popularrecipes'),
    path('newrecipes/', NewRecipes.as_view(), name='newrecipes'),
    path('saverecipe/', AddFavorite.as_view(), name='saverecipes'),
    path('saved/', AllFavourites.as_view(), name='saved'),
    path('recipereview/', RecipeReviews.as_view(), name='recipereview'),
    path('allreviews/', AllReviews.as_view(), name='allreview'),
    path('alltitles/', AllTitles.as_view(), name='alltitles'),
    path('addreview/', AddReview.as_view(), name='addreview'),
    path('deletereview/', DeleteReview.as_view(), name='deletereview'),
    path('addrecipe/', AddRecipe.as_view(), name='addrecipe'),
    path('allcategories/', AllCategories.as_view(), name='allcategories'),
    path('userrecipes/', UserRecipes.as_view(), name='userrecipes'),
]
