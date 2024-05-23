#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import re

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF

import pickle


# In[2]:


df=pd.read_pickle("all_recipes.pkl")
df2=pd.read_pickle("all_users.pkl")


# We Find one record which has a Null Attribute that can be filled manually with relevant data. 

# In[4]:


df.at[776, 'Veg/NonVeg'] = 'Non-Veg'


# Rest of the Null Attributes are beyond repair. so we drop them from the dataset for better model functionality.

# In[5]:


df = df.dropna()
df.drop_duplicates(inplace=True)
df = df.reset_index(drop=True)


# In[6]:


df2.dropna()
df2.drop_duplicates(inplace=True)
df2=df2.reset_index(drop=True)

def processing(value):
    return int(value)

df2['rating']=df2['rating'].apply(processing)
df2['recipe_id']=df2['recipe_id'].apply(processing)
df2['user_id']=df2['user_id'].apply(processing)

df2['date'] = pd.to_datetime(df2['date'], format='%Y-%m-%d')


# **CONVERTING THE FEATURES TO RELEVANT DATATYPE - REVIEWS, CALORIES, CATEGORY, INGREDIENTS**

# In[7]:


def replace_k(value):
    if 'k' in value:
        value=str(value).split('k')
        value=value[0]
        value=float(value)*1000
    return value

df['reviews']=df['reviews'].apply(replace_k)

def cat_2(value):
    return eval(value)

df['category']=df['category'].apply(cat_2)
df['ingredients']=df['ingredients'].apply(cat_2)

df['reviews']=df['reviews'].apply(processing)

def calories(value):
    if value.isdigit():
        return int(value)
    else:
        return 1
df['calories']=df['calories'].apply(calories)

df = df.rename(columns={'ratings': 'avg_rating', 'reviews':'no_reviews', 'Season':'season','DaytimeOfCooking':'meal_type','Veg/NonVeg':'diet_type'})


# In[8]:


df['season'] = df['season'].apply(lambda x: x.split('/'))
df['season'] = df['season'].apply(lambda x: ['Summer', 'Spring', 'Fall', 'Winter'] if x == ['Any'] else x)
df['meal_type'] = df['meal_type'].apply(lambda x: x.split('/'))


# In[9]:


def count_ingredients(ingredients):
    return len(ingredients)

df['no_ingredients'] = df['ingredients'].apply(count_ingredients)


# In[10]:


pattern = re.compile(r'\s*\([^)]*\)')
records = df['diet_type']

cleaned_records = [re.sub(pattern, '', record) for record in records]
df['diet_type'] = cleaned_records


# In[11]:


def clean_text(text):
    text = text.lower()
    nopunct_text = ''.join([char for char in text if char.isalnum() or char.isspace()])
    tokens = word_tokenize(nopunct_text)
    return tokens[0]

df['diet_type'] = df['diet_type'].apply(clean_text)


# In[12]:


# Define a threshold for identifying significant outliers (e.g., 3 standard deviations above the mean)
threshold = 3 * df['total_mins'].std()

# Filter the dataset to include only records with cooking times exceeding the threshold
outliers_df = df[df['total_mins'] > threshold]

# Print the records with significant outlier cooking times


# **OUTLIERS REMOVAL USING IQR METHOD**
# 
# IQR is a robust statistical measure that represents the spread of the middle 50% of the data. It's calculated as the difference between the third quartile (Q3) and the first quartile (Q1).
# In recipe recommendation, outliers could be recipes with:
# 
#     Extremely high or low cooking time.
#     Extremely high or low calories.
#     Unusually large or small numbers of ingredients.

# In[13]:


def iqr_method(outlier):
    #Removing Outliers by IQR Method
    q1=df[outlier].quantile(0.25)
    q3=df[outlier].quantile(0.75)
    iqr=q3-q1
    upper_limit = q3 + (1.5*iqr)
    lower_limit = q1 - (1.5*iqr)
    
    df.loc[(df[outlier]>upper_limit),outlier]=upper_limit
    df.loc[(df[outlier]<lower_limit),outlier]=lower_limit
iqr_method('calories')
iqr_method('no_ingredients')
iqr_method('total_mins')


# In[14]:


df_exploded = df.explode('season')
df_exploded2 = df.explode('meal_type')


# **TOKENIZATION OF TITLE COLUMN**
# 
# REMOVING OF STOP WORDS
# 
# STOP WORDS - those words that occur very frequently in a statement that provide no particular meaning for the ML model training. it is simply existing for grammatical uses like connectors, verbs etc.
# 
# eg. is, am, the, where, when, that, this etc.
# 
# REMOVING SPECIAL CHARACTERS
# 
# punctuations and other decorators were also removed for simplicity and accurate prediction of model.

# In[15]:


def clean_text(text):
    text = text.lower()
    nopunct_text = ''.join([char for char in text if char.isalnum() or char.isspace()])
    tokens = word_tokenize(nopunct_text)
    return tokens

df['cleaned_titles'] = df['title'].apply(clean_text)


# In[16]:


lemmatizer = WordNetLemmatizer()

def lemmatize_feature(df, feature_name):
    df[feature_name] = df[feature_name].apply(lambda row: lemmatize_list(row))
    return df

def lemmatize_list(list_of_strings):
    lemmatized_list = [lemmatizer.lemmatize(word) for word in list_of_strings]
    return lemmatized_list

data = lemmatize_feature(df, 'cleaned_titles')


# Pre - Processing the CATEGORY feature
# 
# removal of any special characters, conversion to lower cases and lemmatization of words for better computation
# after lemmatization, the stop words were removed.

# In[17]:


def lemmatize_category_list(category_list):
    lemmatized_list = []
    for word in category_list:
        lemmatized_category = []
        lemmatized_category.append(lemmatizer.lemmatize(word.strip().lower()))
        lemmatized_list.append(lemmatized_category)
    return lemmatized_list

df['category_lemmatized'] = df['category'].apply(lemmatize_category_list)


# In[18]:


def preprocess_ingredients(ingredients):

    ingredients=[ingredient.lower() for ingredient in ingredients]

    pattern=r'[^\w]'  # Matches any non-alphanumeric character
    ingredients=[re.sub(pattern, ' ', ingredient) for ingredient in ingredients]

    lemmatizer=WordNetLemmatizer()
    processed_ingredients=[[lemmatizer.lemmatize(word) for word in ingredients]]

    return processed_ingredients

ingre=df['ingredients'].apply(preprocess_ingredients)

stop_words = stopwords.words('english') 

def filter_custom_stop_words(data):
    new_stop_words =['taste','softened','teaspoon','teaspoons','tablespoons','cups','ounces','tablespoon',
                     'cup','ounce','pinch','salt','ground','large','finely','chopped','grated','optional',
                     'crushed','drained','divided','shredded','sliced','half','peeled','freshly','needed',
                     'frying','prepared','cut','small','cube','water','warm','ml','l','g','kg','mg','dl',
                     'gill','diced','pound','pint','quant','gallon','fl oz','°C','°F']
    for i in new_stop_words:
        stop_words.append(i)
        
    filtered_data = []
    for recipe in data:
        sublist2 = []
        for sublist2_item in recipe:
            for i in sublist2_item:
                filtered_sublist3 = [word for word in i.split() if word not in stop_words and word.isalpha()]
                sublist2.append(filtered_sublist3)
        filtered_data.append(sublist2)
    return filtered_data

#function call for filtering
filtered_data = filter_custom_stop_words(ingre)

df['ingredients_filtered']=filtered_data

def join_lists(data):

    joined_list = []
    for sublist in data:
        joined_list.append([' '.join(x) for x in sublist])  # Join elements with space
    return joined_list

# Join elements in each sublist
df['ingredients_filtered'] = join_lists(df['ingredients_filtered'])
df['category_lemmatized'] = join_lists(df['category_lemmatized'])
df['category_lemmatized']=df['category_lemmatized'].apply(lambda x: ', '.join(x))


# In[19]:


df=df.drop(['title','category','ingredients'],axis=1)


# In[20]:


for i in df['ingredients_filtered']:
    for j in i:
        if len(j)<1:
            i.remove(j)
            
def to_string(value):
    comb_str=' '.join(value)
    return comb_str

df['ingredients_filtered']=df['ingredients_filtered'].apply(to_string)
ingredients_filtered=df[['recipe_id','ingredients_filtered']]


# **RECOMMENDATION BASED ON INGREDIENT SIMILARITY**
# 
# I DID THIS BY TAKING THE VECTOR FORMAT OF THE INGREDIENTS, CATEGORY AND TITLE COLUMN OF EACH RECIPE AND THEN FURTHER PLOTTING THE SIMILARITY BETWEEN EACH RECIPE USING COSINE SIMILARITY.
# THIS IS DONE BY USING THE K-NEAREST NEIGHBOURS ALGORITHM. HERE K IS CHOSEN TO BE 10.
# 
# 
# THIS MODEL SUGGESTS SIMILAR RECIPES WHEN ONE RECIPE IS VIEWED. THIS COULD GIVE OPTIONS FOR THE USER TO PICK.

# In[21]:


vectorizer=TfidfVectorizer()

df['combined_text'] = df['cleaned_titles'].apply(' '.join) + ' ' + df['ingredients_filtered'] + ' ' + df['category_lemmatized']


recipe_text_features = vectorizer.fit_transform(df['combined_text'])

similarity=cosine_similarity(recipe_text_features, recipe_text_features)


# In[22]:


knn = NearestNeighbors(n_neighbors=10, algorithm='auto', metric='cosine')
knn.fit(recipe_text_features)

def recommend_recipe(recipe_id):
    
    if recipe_id not in df['recipe_id'].values:
        print("Recipe ID not found.")
        return []
    
    recipe_index = df.index[df['recipe_id'] == recipe_id].tolist()[0]
    
    #fetching nearest neighbors for the recipe at the found index
    distances, indices = knn.kneighbors(recipe_text_features[recipe_index].reshape(1, -1), n_neighbors=10)
    recommendations = []

    for i in range(1, len(distances.flatten())):
        recommended_recipe_id = df['recipe_id'][indices.flatten()[i]]
        recommendations.append(recommended_recipe_id)
    
    return recommendations

#example
recommendations_list = recommend_recipe(220596)
print("Recommendations list:", recommendations_list)


# In[23]:


pickle.dump(recommend_recipe, open('KNN_model.pkl','wb'))
'''loaded_recommend_recipes = pickle.load(open("KNN_model.pkl", "rb"))
print(loaded_recommend_recipes(222337))'''


# In[24]:


df['ingredients_filtered'] = df['ingredients_filtered'].apply(lambda x: ''.join(x))
df['cleaned_titles'] = df['cleaned_titles'].apply(lambda x: ' '.join(x))


# **MATRIX FACTORIZATION USING USER RATING AND COMBINATION OF INGREDIENTS,TITLE AND CATEGORY OF FOOD**
# 
# MATRIX FACTORIZATION IS COMMONLY USED FOR DETECTING A PATTERN BETWEEN DIFFERENT USERS AND THEIR INTEREST. SINCE WE HAVE DATASET OF USER RATING FOR DIFFERENT RECIPES, WE COULD PLOT USER VS. RECIPE MATRIX. THIS COULD SUGGEST RECIPES FOR A USER THAT WAS ACCEPTED BY A SIMILAR USER.
# 
# FOR THIS MODEL, THE INPUT IS USER_ID AND OUTPUT IS A SERIES OF RECIPE_ID'S
# 

# In[25]:


user_recipe_df=df2.merge(df,on='recipe_id')

#user-recipe matrix

user_recipe_df = user_recipe_df[user_recipe_df['rating'] >= 3]
rating_matrix=user_recipe_df.pivot_table(values='rating',index='user_id',columns='recipe_id').fillna(0)


# In[26]:


num_factors=10

#perform NMF Non-Negative Matrix Factorization
nmf = NMF(n_components=num_factors, random_state=42)
user_factors=nmf.fit_transform(rating_matrix)
recipe_factors=nmf.components_

user_id_to_index = {user_id: idx for idx, user_id in enumerate(rating_matrix.index)}

# Function to recommend recipes based on user ID
def recommend_recipes(user_id, top_n=10):
    if user_id not in user_id_to_index:
        print(f"User ID {user_id} not found.")
        return []
    
    user_index = user_id_to_index[user_id]
    user_factor = user_factors[user_index]
    predicted_ratings = user_factor.dot(recipe_factors)
    top_recipe_indices = predicted_ratings.argsort()[-top_n:][::-1]  # Get top n indices, sorted in descending order
    
    # Map indices back to recipe IDs
    top_recipe_ids = rating_matrix.columns[top_recipe_indices]
    return top_recipe_ids

#recommendations for user with ID 
recommended_recipes_CF=recommend_recipes(16)

print(recommended_recipes_CF)


# In[27]:


pickle.dump(recommend_recipes, open('CF_model.pkl','wb'))
'''CF_recommend_recipes = pickle.load(open("CF_model.pkl", "rb"))
CF_recommend_recipes(16)'''

