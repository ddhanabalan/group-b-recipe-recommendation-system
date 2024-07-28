# group-b-recipe-recommendation-system

## Overview
The Recipe Recommendation System is a web application designed to simplify meal planning and recipe selection. It addresses the common issue of deciding what to cook by providing personalized recipe recommendations based on user preferences.

## Technology Stack
Frontend: React
Backend: Python Django
Containerization: Docker

### API Endpoints
The backend APIs are organized into the following folders:

recipe/: Contains APIs for recipe management.
authentication/: Contains APIs for user authentication and registration.
recipesystem/: Contains APIs for recommendation and additional recipe-related functionalities.

### Frontend Features
Recipe Display: Lists recipes with options to view details.
Search and Filter: Allows users to search recipes and apply filters based on categories, seasons, and cooking times.
User Preferences: Users can set dietary preferences to receive personalized recommendations.
Recipe Creation and Editing: Users can create new recipes and edit the created ones.

### Backend Features
Recipe Management: Handles CRUD operations for recipes.
User Management: Manages user authentication and preferences.
Recommendation Engine: Provides personalized recipe recommendations based on user data.

## Getting Started

To set up the project locally:

1. *Clone the repository*:
    bash
    git clone <repository-url>
    cd <repository-folder>
    

2. *Build and run the Docker containers*:
    bash
    docker-compose up --build
    

3. *Access the application*:
    - *Frontend*: [http://localhost:3000](http://localhost:3000)
    - *Backend*: [http://localhost:8000](http://localhost:8000)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. *Fork the repository*.
2. *Create a new branch* for your feature or fix.
3. *Submit a pull request* with a description of your changes.