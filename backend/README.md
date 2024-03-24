# group-b-recipe-recommendation-system-backend

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
        "error": "User with provided email does not exist"
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
- Django REST Framework
