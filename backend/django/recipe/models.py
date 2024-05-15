from django.db import models
from authentication.models import User

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'category'

class Recipe(models.Model):
    recipeid = models.IntegerField(primary_key=True, unique=True)
    userid = models.ForeignKey(User, on_delete=models.CASCADE,db_column='userid') 
    title = models.CharField(max_length=255)
    ingredients = models.TextField()
    img = models.URLField()
    calories = models.IntegerField()
    rating = models.FloatField(default=0)
    total_reviews = models.IntegerField(default=0)
    season = models.CharField(max_length=255)
    daytimeofcooking = models.CharField(max_length=255)
    veg_nonveg = models.CharField(max_length=255)
    total_mins = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'recipe'

class RecipeCategories(models.Model):
    recipeid = models.ForeignKey(Recipe, on_delete=models.CASCADE, db_column='recipeid')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        db_table = 'recipe_categories'

class Favorite(models.Model):
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userid')
    recipeid = models.ForeignKey(Recipe, on_delete=models.CASCADE, db_column='recipeid')

    class Meta:
        db_table = 'favourites'

class Reviews(models.Model):
    id = models.AutoField(primary_key=True)
    recipeid = models.ForeignKey(Recipe, on_delete=models.CASCADE, db_column='recipeid')
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userid')
    username = models.CharField(max_length=255)
    review = models.TextField()
    review_date = models.DateField()

    class Meta:
        db_table = 'reviews'
        
class History(models.Model):
    userid = models.ForeignKey(User, on_delete=models.CASCADE, db_column='userid')
    recipeid = models.ForeignKey(Recipe, on_delete=models.CASCADE, db_column='recipeid')

    class Meta:
        db_table = 'user_history'
