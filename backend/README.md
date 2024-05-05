<!-- # group-b-recipe-recommendation-system-backend

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Signup](#signup)
  - [Login](#login)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
- [Dependencies](#dependencies)

## API Endpoints

### Signup

#### Request

- **URL:** `/authentication/signup/`
- **Method:** POST
- **Body:**
  - `username`: string (required)
  - `password`: string (required)
  - `email`: string (required)
  - Additional fields as per your User model

#### Response

- **Success Response:**
  - **Code:** 201 CREATED
  - **Content:** 
    ```json
    {
        "id": 1,
        "username": "example",
        "email": "example@example.com",
        ...
    }
    ```
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** 
    ```json
    {
        "error": "Error message goes here"
    }
    ```

### Login

#### Request

- **URL:** `/authentication/login/`
- **Method:** POST
- **Body:**
  - `username`: string (required)
  - `password`: string (required)

#### Response

- **Success Response:**
  - **Code:** 200 OK
  - **Content:** 
    ```json
    {
        "id": 1,
        "username": "example",
        "email": "example@example.com",
        ...
    }
    ```
- **Error Response:**
  - **Code:** 401 UNAUTHORIZED
  - **Content:** 
    ```json
    {
        "error": "Invalid username or password"
    }
    ```

### Forgot Password

#### Request

- **URL:** `/authentication/forgot-password/`
- **Method:** POST
- **Body:**
  - `username`: string (required)
  - `email`: string (required)

#### Response

- **Success Response:**
  - **Code:** 200 OK
  - **Content:** 
    ```json
    {
        "message": "Password reset email sent"
    }
    ```
- **Error Response:**
  - **Code:** 404 NOT FOUND
  - **Content:** 
    ```json
    {
        "error": "User with provided username or email does not exist"
    }
    ```

### Reset Password

#### Request

- **URL:** `/authentication/reset/{uidb64}/{token}/`
- **Method:** POST
- **Body:**
  - `new_password`: string (required)

#### Response

- **Success Response:**
  - **Code:** 200 OK
  - **Content:** 
    ```json
    {
        "message": "Password reset successful"
    }
    ```
- **Error Response:**
  - **Code:** 400 BAD REQUEST
  - **Content:** 
    ```json
    {
        "error": "Invalid reset link"
    }
    ```

## Dependencies

- Django
- Django REST Framework -->

# Group B Recipe Recommendation System Backend

## Overview

This is the backend component of the Group B Recipe Recommendation System, providing API endpoints for user authentication, recipe management, and more.

## API Endpoints

- [User Signup](#user-signup)
- [Verify Email](#verify-email)
- [User Login](#user-login)
- [Logout](#logout)
- [Forgot Password](#forgot-password)
- [Reset Password](#reset-password)
- [All Recipes](#all-recipes)
- [Popular Recipes](#popular-recipes)
- [New Recipes](#new-recipes)
- [Add Favorite](#add-favorite)
- [All Favorites](#all-favorites)
- [Recipe Reviews](#recipe-reviews)
- [All Reviews](#all-reviews)
- [All Titles](#all-titles)
- [Add Review](#add-review)
- [Delete Review](#delete-review)
- [Add Recipe](#add-recipe)
- [All Categories](#all-categories)
- [User Recipes](#user-recipes)

## User Signup

**URL:** `/authentication/signup/`  
**Method:** `POST`  
**Description:** Allows users to register for a new account.  
**Parameters:**
- `username`: string (required)
- `password`: string (required)
- `email`: string (required)

## Verify Email

**URL:** `/authentication/verify-email/`  
**Method:** `POST`  
**Description:** Allows users to verify their email address using the verification code sent to their email after signup.  
**Parameters:**
- `email`: string (required)
- `vericode`: string (required)

## User Login

**URL:** `/authentication/login/`  
**Method:** `POST`  
**Description:** Allows registered users to log in to their account.  
**Parameters:**
- `username`: string (required)
- `password`: string (required)

## Logout

**URL:** `/authentication/logout/`  
**Method:** `POST`  
**Description:** Logs out the authenticated user and invalidates their token.

## Forgot Password

**URL:** `/authentication/forgot-password/`  
**Method:** `POST`  
**Description:** Initiates the process to reset the user's password by sending a password reset email.  
**Parameters:**
- `username`: string (required)
- `email`: string (required)

## Reset Password

**URL:** `/authentication/reset-password-confirm/<uidb64>/<token>/`  
**Method:** `POST`  
**Description:** Allows users to reset their password using the password reset link sent to their email after initiating the forgot password process.  
**Parameters:**
- `new_password`: string (required)

## All Recipes

**URL:** `/allrecipes/`  
**Method:** `GET`  
**Description:** Retrieves all recipes.  

## Popular Recipes

**URL:** `/popularrecipes/`  
**Method:** `GET`  
**Description:** Retrieves popular recipes.  

## New Recipes

**URL:** `/newrecipes/`  
**Method:** `GET`  
**Description:** Retrieves new recipes.  

## Add Favorite

**URL:** `/saverecipe/`  
**Method:** `POST`  
**Description:** Adds a recipe to favorites.  

## All Favorites

**URL:** `/saved/`  
**Method:** `POST`  
**Description:** Retrieves all favorite recipes for a user.  

## Recipe Reviews

**URL:** `/recipereview/`  
**Method:** `POST`  
**Description:** Retrieves reviews for a recipe.  

## All Reviews

**URL:** `/allreviews/`  
**Method:** `GET`  
**Description:** Retrieves all reviews.  

## All Titles

**URL:** `/alltitles/`  
**Method:** `GET`  
**Description:** Retrieves titles of all recipes.  

## Add Review

**URL:** `/addreview/`  
**Method:** `POST`  
**Description:** Adds a review for a recipe.  

## Delete Review

**URL:** `/deletereview/`  
**Method:** `DELETE`  
**Description:** Deletes a review.  

## Add Recipe

**URL:** `/addrecipe/`  
**Method:** `POST`  
**Description:** Adds a new recipe.  

## All Categories

**URL:** `/allcategories/`  
**Method:** `GET`  
**Description:** Retrieves all recipe categories.  

## User Recipes

**URL:** `/userrecipes/`  
**Method:** `POST`  
**Description:** Retrieves recipes for a user.  

## Dependencies

- Django
- Django REST Framework
- Django Simple JWT
