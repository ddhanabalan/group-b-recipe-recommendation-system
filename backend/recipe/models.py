from django.db import models
from authentication.models import User

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'category'

    def __str__(self):
        return self.name

class Recipe(models.Model):
    recipeid = models.IntegerField(primary_key=True, unique=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,db_column='userid') 
    title = models.CharField(max_length=255)
    ingredients = models.TextField()
    img = models.URLField()
    calories = models.IntegerField()
    rating = models.FloatField()
    total_reviews = models.IntegerField()
    season = models.CharField(max_length=255)
    daytimeofcooking = models.CharField(max_length=255)
    veg_nonveg = models.CharField(max_length=255)
    total_mins = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'recipe'

    def __str__(self):
        return self.title


class RecipeCategories(models.Model):
    recipeid = models.ForeignKey(Recipe, on_delete=models.CASCADE, db_column='recipeid')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        db_table = 'recipe_categories'

    def __str__(self):
        return f"{self.recipe.title} - {self.category.name}"
