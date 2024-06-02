from django.urls import path
from recommend.views import RecipePrediction, UserPrediction


urlpatterns = [
    path('reciperecommend/', RecipePrediction.as_view(), name='reciperecommend'),
    path('userrecommend/', UserPrediction.as_view(), name='userrecommend'),
]