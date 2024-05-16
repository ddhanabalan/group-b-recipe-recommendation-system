from django.urls import path
from recipe.views import AllRecipes,PopularRecipes,NewRecipes, AddFavorite, AllFavourites, RecipeReviews,RecipeReviewsLimited, AllReviews, AllReviewsLimited, AllTitles, AddReview, DeleteReview,AddRecipe, AllCategories, UserRecipes, RemoveFavourites, UserHistory

urlpatterns = [
    path('allrecipes/', AllRecipes.as_view(), name='allrecipes'),
    path('popularrecipes/', PopularRecipes.as_view(), name='popularrecipes'),
    path('newrecipes/', NewRecipes.as_view(), name='newrecipes'),
    path('saverecipe/', AddFavorite.as_view(), name='saverecipes'),
    path('deletefavourite/', RemoveFavourites.as_view(), name='deletefavourite'),
    path('saved/', AllFavourites.as_view(), name='saved'),
    path('recipereviews/', RecipeReviews.as_view(), name='recipereviews'),
    path('recipereviewslimited/', RecipeReviewsLimited.as_view(), name='recipereviewslimited'),
    path('allreviews/', AllReviews.as_view(), name='allreviews'),
    path('allreviewslimited/', AllReviewsLimited.as_view(), name='allreviewslimited'),
    path('alltitles/', AllTitles.as_view(), name='alltitles'),
    path('addreview/', AddReview.as_view(), name='addreview'),
    path('deletereview/', DeleteReview.as_view(), name='deletereview'),
    path('addrecipe/', AddRecipe.as_view(), name='addrecipe'),
    path('allcategories/', AllCategories.as_view(), name='allcategories'),
    path('userrecipes/', UserRecipes.as_view(), name='userrecipes'),
    path('userhistory/', UserHistory.as_view(), name='userhistory'),
]
