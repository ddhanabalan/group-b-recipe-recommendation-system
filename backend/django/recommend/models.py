from django.db import models
from authentication.models import User
from recipe.models import Recipe, Category

class Recommendation(models.Model):
    id = models.AutoField(primary_key=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userid')
    date = models.DateField(auto_now_add=True, db_column='date')
    avg_like_status = models.BooleanField(db_column='avg_like_status', null=True)

    class Meta:
        db_table = 'recommendation'

class RecommendedRecipes(models.Model):
    id = models.AutoField(primary_key=True)
    recipeid = models.ForeignKey(Recipe, on_delete=models.CASCADE, db_column='recipeid')
    recmd_id = models.ForeignKey(Recommendation, related_name='recipes', on_delete=models.CASCADE, db_column='recmd_id')
    like_status = models.BooleanField(db_column='like_status', null=True)

    class Meta:
        db_table = 'recommended_recipes'

# class RecommendedCategory(models.Model):
#     id = models.AutoField(primary_key=True)
#     recmd_id = models.ForeignKey(Recommendation, related_name='categories', on_delete=models.CASCADE, db_column='recmd_id')
#     recipe_category_id = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='recipe_category_id')

#     class Meta:
#         db_table = 'recommended_category'