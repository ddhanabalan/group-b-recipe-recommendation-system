# Group B Recipe Recommendation System Backend

## Overview

This is the backend component of the Group B Recipe Recommendation System, providing API endpoints for user authentication, recipe management, and more.

## Authentication APIs

All authentication endpoints are prefixed with `/authentication/`.

| Endpoint | Description |
| --- | --- |
| `POST /authentication/signup/` | User sign-up |
| `POST /authentication/login/` | User login |
| `POST /authentication/token/refresh/` | Refresh authentication token |
| `POST /authentication/forgot-password/` | Request password reset |
| `POST /authentication/reset/<str:uidb64>/<str:token>/` | Confirm password reset |
| `POST /authentication/verify-email/` | Verify email address |
| `POST /authentication/logout/` | User logout |
| `POST /authentication/change-username/` | Change username |
| `POST /authentication/change-password/` | Change password |
| `GET /authentication/userdetails/` | Fetch username and email |
| `POST /authentication/addfeedback/` | Add feedback |
| `DELETE /authentication/deletefeedback/` | Delete feedback |
| `GET /authentication/allfeedbacklimited/` | Fetch limited feedback |
| `GET /authentication/alluserslimited/` | Fetch limited users |
| `GET /authentication/userscount/` | Get users count |
| `GET /authentication/feedbackcount/` | Get feedback count |
| `DELETE /authentication/deleteuser/` | Delete user |
| `GET /authentication/newuserscount/` | Get new users count in the last 30 days |
| `GET /authentication/newusersdetails/` | Get new users details in the last 30 days |
| `POST /authentication/addpreference/` | Add user preference |
| `POST /authentication/addfoodtype/` | Add food type |
| `GET /authentication/userpreferences/` | Fetch user preferences |

## Recipe APIs

All recipe endpoints are prefixed with `/recipe/`.

| Endpoint | Description |
| --- | --- |
| `GET /recipe/allrecipes/` | Fetch all recipes |
| `GET /recipe/allrecipeslimited/` | Fetch limited recipes |
| `POST /recipe/popularrecipes/` | Fetch popular recipes |
| `POST /recipe/newrecipes/` | Fetch new recipes |
| `POST /recipe/saverecipe/` | Save recipe to favorites |
| `DELETE /recipe/deletefavourite/` | Remove recipe from favorites |
| `GET /recipe/saved/` | Fetch all favorite recipes |
| `GET /recipe/recipereviews/` | Fetch recipe reviews |
| `GET /recipe/recipereviewslimited/` | Fetch limited recipe reviews |
| `GET /recipe/allreviews/` | Fetch all reviews |
| `GET /recipe/allreviewslimited/` | Fetch limited reviews |
| `GET /recipe/alltitles/` | Fetch all recipe titles |
| `POST /recipe/addreview/` | Add review |
| `DELETE /recipe/deletereview/` | Delete review |
| `POST /recipe/addrecipe/` | Add recipe |
| `DELETE /recipe/deleterecipe/` | Delete recipe |
| `GET /recipe/userrecipes/` | Fetch user recipes |
| `GET /recipe/allcategories/` | Fetch all recipe categories |
| `POST /recipe/userhistory/` | Add to user history |
| `GET /recipe/recipescount/` | Get recipes count |
| `GET /recipe/reviewscount/` | Get reviews count |
| `GET /recipe/newrecipescount/` | Get new recipes count in the last 30 days |
| `GET /recipe/newrecipesdetails/` | Get new recipes details in the last 30 days |
| `POST /recipe/upload/` | Upload media |
| `GET /recipe/fetchhistory/` | Fetch user history |
| `DELETE /recipe/deleteallhistory/` | Delete all user history |
| `DELETE /recipe/deletehistory/` | Delete specific user history |
| `POST /recipe/addsearchhistory/` | Add to user search history |
| `GET /recipe/singlerecipe/` | Fetch single recipe |
| `POST /recipe/editrecipe/` | Edit recipe |
| `POST /recipe/maderecipe/` | Mark recipe as made |

## Recommendation APIs

All recommendation endpoints are prefixed with `/recommend/`.

| Endpoint | Description |
| --- | --- |
| `POST /recommend/reciperecommend/` | Get recipe recommendation |
| `POST /recommend/userrecommend/` | Get user recommendation |

## Dependencies

The project dependencies are listed below :

- `asgiref==3.8.0`
- `charset-normalizer==3.3.2`
- `contourpy==1.2.1`
- `cycler==0.12.1`
- `Django==5.0.3`
- `django-cors-headers==4.3.1`
- `djangorestframework==3.15.1`
- `djangorestframework-simplejwt==5.3.1`
- `fonttools==4.51.0`
- `idna==3.7`
- `joblib==1.4.2`
- `kiwisolver==1.4.5`
- `matplotlib==3.9.0`
- `mysqlclient==2.2.4`
- `nltk==3.8.1`
- `numpy==1.26.4`
- `packaging==24.0`
- `pandas==2.2.2`
- `pillow==10.3.0`
- `PyJWT==2.8.0`
- `pyparsing==3.1.2`
- `python-dateutil==2.9.0.post0`
- `python-dotenv==1.0.1`
- `pytz==2024.1`
- `regex==2024.5.15`
- `requests==2.31.0`
- `scikit-learn==1.4.2`
- `scipy==1.13.0`
- `seaborn==0.13.2`
- `six==1.16.0`
- `sqlparse==0.4.4`
- `threadpoolctl==3.5.0`
- `tqdm==4.66.4`
- `tzdata==2024.1`
- `urllib3==2.2.1`
- `celery==5.4.0`
- `redis==5.0.6`
- `django-celery-beat`
- `gevent`
