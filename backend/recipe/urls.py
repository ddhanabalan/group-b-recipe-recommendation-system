from django.urls import path
from recipe.views import RecipeListView

urlpatterns = [
    path('allrecipes/', RecipeListView.as_view(), name='allrecipes'),
]