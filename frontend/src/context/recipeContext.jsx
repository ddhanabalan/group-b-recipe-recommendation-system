import React, { createContext, useState, useEffect } from "react";

const RecipeContext = createContext();

const RecipeContextProvider = ({ children }) => {
  const [distinctCategories, setDistinctCategories] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/recipe/allrecipes");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        //the dummy data for trying the feature

        // Dummy data for recipes
        {
          /*} const data = [
          {
            recipeid: 219075,
            userid: null,
            title: "Pecan and Apricot Sourdough Bread Stuffing",
            ingredients:
              "['1 (1 pound) loaf sourdough bread, torn into pieces', '1/4 cup butter', '1 cup diced onion', '1 cup diced celery', '1 teaspoon herbes de Provence', '1 teaspoon rubbed sage', '4 ounces chopped dried apricots', '1 cup toasted pecan halves, chopped', 'salt and freshly ground black pepper to taste', '2 cups chicken broth', '1 egg, beaten']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/4006993.jpg",
            calories: 291,
            rating: 4.34783,
            total_reviews: 15,
            season: "Fall/Winter",
            daytimeofcooking: "Side Dish",
            veg_nonveg: "Veg (Optional Egg)",
            total_mins: 80,
            created_at: "2024-05-04T12:56:04Z",
            categories: [
              "Side Dish",
              "Stuffing and Dressing",
              "Bread Stuffing and Dressing",
            ],
          },
          {
            recipeid: 219076,
            userid: null,
            title: "Chef John's Turkey Chili ",
            ingredients:
              "['1/4 cup ancho chile powder', '1 tablespoon paprika', '1 tablespoon ground cumin', '2 1/2 teaspoons salt', '1 1/2 teaspoons ground dried chipotle pepper', '1 teaspoon dried oregano', '1 teaspoon unsweetened cocoa powder', '1 teaspoon ground black pepper', '1/4 teaspoon ground cayenne pepper', '1/8 teaspoon ground cinnamon', '1 tablespoon olive oil', '1 onion, chopped', '2 1/2 pounds ground turkey', '3 cloves garlic, minced', '1 cup tomato puree', '2 cups water', '2 (12 ounce) cans pinquito or pinto beans, drained and rinsed']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/5426702.jpg",
            calories: 448,
            rating: 4.66667,
            total_reviews: 94,
            season: "Fall/Winter",
            daytimeofcooking: "Dinner",
            veg_nonveg: "Non-Veg (Turkey)",
            total_mins: 110,
            created_at: "2024-05-04T12:55:57Z",
            categories: ["Soups, Stews and Chili", "Chili", "Turkey Chili"],
          },
          {
            recipeid: 219077,
            userid: null,
            title: "Chef John's Perfect Mashed Potatoes",
            ingredients:
              "['3 large russet potatoes, peeled and cut in half lengthwise', '1/4 cup butter', '1/2 cup whole milk', 'salt and ground black pepper to taste']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/4573816.jpg",
            calories: 333,
            rating: 4.80146,
            total_reviews: 545,
            season: "Any",
            daytimeofcooking: "Side Dish",
            veg_nonveg: "Veg",
            total_mins: 40,
            created_at: "2024-05-04T12:55:55Z",
            categories: ["Side Dish", "Potatoes", "Mashed Potatoes"],
          },
          {
            recipeid: 219078,
            userid: null,
            title: "Butternut Squash Cakes",
            ingredients:
              "['1 tablespoon olive oil', '1/4 cup diced onion', '2 cups grated butternut squash, packed', '1 teaspoon curry powder', '1/2 teaspoon ground cumin', '1/2 teaspoon sea salt', '1/2 teaspoon freshly ground black pepper', '1 large egg, beaten', \"1/4 cup garbanzo-fava bean flour (such as Bob's Red Mill®)\", \"3 tablespoons corn flour (such as Bob's Red Mill®)\", '2 tablespoons olive oil', '1/4 cup sour cream for garnish (optional)', '2 tablespoons pumpkin seeds for garnish (optional)']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/3778903.jpg",
            calories: 250,
            rating: 4.62963,
            total_reviews: 46,
            season: "Fall/Winter",
            daytimeofcooking: "Side Dish",
            veg_nonveg: "Veg",
            total_mins: 50,
            created_at: "2024-05-04T12:56:00Z",
            categories: ["Side Dish", "Vegetables", "Squash"],
          },
          {
            recipeid: 219079,
            userid: null,
            title: "Chef John's Roast Turkey and Gravy",
            ingredients:
              "['2 tablespoons kosher salt', '1 tablespoon ground black pepper', '1 tablespoon poultry seasoning', '1 (12 pound) whole turkey, neck and giblets reserved', '2 onions, coarsely chopped', '3 ribs celery, coarsely chopped', '2 carrots, coarsely chopped', '3 sprigs fresh rosemary', '1/2 bunch fresh sage', '1/2 cup butter', '1 bay leaf', '6 cups water', '2 tablespoons turkey fat', '1 tablespoon butter', '1/4 cup all-purpose flour', '3 cups turkey pan drippings', '1/4 teaspoon balsamic vinegar (optional)', '1 tablespoon chopped fresh sage', 'salt and ground black pepper to taste']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1061659.jpg",
            calories: 942,
            rating: 4.89073,
            total_reviews: 229,
            season: "Fall/Winter",
            daytimeofcooking: "Dinner",
            veg_nonveg: "Non-Veg (Turkey)",
            total_mins: 295,
            created_at: "2024-05-04T12:55:56Z",
            categories: ["Meat and Poultry", "Turkey", "Whole"],
          },
          {
            recipeid: 219082,
            userid: null,
            title: "Turkey Cocktail Meatballs with Orange Cranberry Glaze",
            ingredients:
              "['1 1/4 pounds ground turkey', '1/4 teaspoon poultry seasoning', '1/2 teaspoon garlic salt', '1 teaspoon onion powder', '1 teaspoon salt', '1/2 teaspoon ground black pepper', '1/4 teaspoon Worcestershire sauce', '1 pinch cayenne pepper', '1 large egg, beaten', '1/4 cup milk', '1/2 cup plain bread crumbs', '1 tablespoon olive oil', '1 cup canned jellied cranberry sauce', '1/2 cup orange marmalade', '1/2 cup chicken broth', '1 tablespoon minced jalapeno pepper (optional)', '1 tablespoon minced Fresno pepper (optional)', 'salt and ground black pepper to taste']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/748011.jpg",
            calories: 264,
            rating: 4.61176,
            total_reviews: 65,
            season: "Any",
            daytimeofcooking: "Appetizer",
            veg_nonveg: "Non-Veg (Turkey)",
            total_mins: 35,
            created_at: "2024-05-04T12:55:58Z",
            categories: ["Appetizers and Snacks", "Meat and Poultry", "Turkey"],
          },
          {
            recipeid: 219086,
            userid: null,
            title: "Chef John's Baked Acorn Squash",
            ingredients:
              "['2 acorn squash, cut in half lengthwise and seeded', '2 tablespoons fresh orange juice', 'salt to taste', '2 tablespoons unsalted butter', '2 tablespoons maple syrup', '1 tablespoon brown sugar', 'ground black pepper to taste', '1 pinch cayenne pepper']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/3250991.jpg",
            calories: 194,
            rating: 4.52885,
            total_reviews: 68,
            season: "Fall/Winter",
            daytimeofcooking: "Side Dish",
            veg_nonveg: "Veg",
            total_mins: 65,
            created_at: "2024-05-04T12:55:58Z",
            categories: [
              "Side Dish",
              "Vegetables",
              "Squash",
              "Acorn Squash Side Dishes",
            ],
          },
          {
            recipeid: 219088,
            userid: null,
            title: "Roast Chicken Pan Gravy",
            ingredients:
              "['1/4 cup drippings from a roast chicken', '2 1/2 tablespoons all-purpose flour', '2 cups cold chicken stock, or more if needed', 'salt and ground black pepper to taste']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1014195.jpg",
            calories: 43,
            rating: 4.86538,
            total_reviews: 36,
            season: "Any",
            daytimeofcooking: "Side Dish",
            veg_nonveg: "Non-Veg (Chicken)",
            total_mins: 15,
            created_at: "2024-05-04T12:56:00Z",
            categories: ["Side Dish", "Sauces and Condiments", "Gravy"],
          },
          {
            recipeid: 219090,
            userid: null,
            title: "Homemade Chicken Gravy",
            ingredients:
              "['1/2 cup unsalted butter', '1/2 cup all-purpose flour', '1 quart cold chicken stock', '1/3 cup heavy cream', 'salt and ground white pepper to taste', '1 pinch cayenne pepper']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/956217.jpg",
            calories: 170,
            rating: 4.55556,
            total_reviews: 146,
            season: "Any",
            daytimeofcooking: "Sauce",
            veg_nonveg: "Non-Veg (Optional Meat)",
            total_mins: 30,
            created_at: "2024-05-04T12:55:56Z",
            categories: ["Side Dish", "Sauces and Condiments", "Gravy"],
          },
          {
            recipeid: 219091,
            userid: null,
            title: "Chef John's Mushroom Gravy",
            ingredients:
              "['1/4 cup butter', '1 (16 ounce) package sliced mushrooms', 'salt to taste', '1/4 cup all-purpose flour, or as needed', '1 quart beef stock', '1 pinch ground black pepper to taste', 'fresh thyme leaves, to taste (optional)']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/948587.jpg",
            calories: 133,
            rating: 4.79322,
            total_reviews: 231,
            season: "Any",
            daytimeofcooking: "Side Dish",
            veg_nonveg: "Veg",
            total_mins: 1,
            created_at: "2024-05-04T12:55:56Z",
            categories: ["Side Dish", "Sauces and Condiments", "Gravy"],
          },
          {
            recipeid: 219106,
            userid: null,
            title: "Garlic-Ginger Chicken Wings",
            ingredients:
              "['cooking spray', '5 pounds chicken wings, separated at joints, tips discarded', 'salt and ground black pepper to taste', \"3 tablespoons hot sauce (such as Frank's Red Hot ®)\", '2 tablespoons vegetable oil', '1 cup all-purpose flour', '3 crushed garlic cloves', '2 tablespoons minced fresh ginger root', '1 tablespoon Asian chile pepper sauce', '1/2 cup rice vinegar', '1/2 cup packed brown sugar', '1 tablespoon soy sauce']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1221397.jpg",
            calories: 230,
            rating: 4.69091,
            total_reviews: 227,
            season: "Any",
            daytimeofcooking: "Appetizer",
            veg_nonveg: "Non-Veg (Chicken)",
            total_mins: 75,
            created_at: "2024-05-04T12:55:56Z",
            categories: ["Appetizers and Snacks", "Spicy"],
          },
          {
            recipeid: 219107,
            userid: null,
            title: "Sweet Hot Mustard Chicken Wings",
            ingredients:
              "['2 pounds chicken wings, separated at joints, tips discarded', 'salt to taste', '2 tablespoons Dijon mustard', '2 tablespoons prepared yellow mustard', '3 tablespoons honey', '2 teaspoons cider vinegar', 'salt and ground black pepper to taste', '1 teaspoon hot pepper sauce']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1108660.jpg",
            calories: 177,
            rating: 4.62609,
            total_reviews: 81,
            season: "Any",
            daytimeofcooking: "Appetizer",
            veg_nonveg: "Non-Veg (Chicken)",
            total_mins: 50,
            created_at: "2024-05-04T12:55:58Z",
            categories: ["Appetizers and Snacks", "Spicy"],
          },
          {
            recipeid: 219108,
            userid: null,
            title: "Pastrami Chicken Wings",
            ingredients:
              "['2 1/2 pounds chicken wings, separated at joints, tips discarded', '1 tablespoon vegetable oil', '1/4 teaspoon white pepper', '1 tablespoon freshly ground black pepper', '1 1/2 tablespoons ground coriander', '1 tablespoon smoked paprika', '1 pinch cayenne pepper (optional)', '2 teaspoons kosher salt', '2 teaspoons all-purpose flour']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1467390.jpg",
            calories: 260,
            rating: 4.63636,
            total_reviews: 45,
            season: "Any",
            daytimeofcooking: "Dinner",
            veg_nonveg: "Non-Veg (Chicken)",
            total_mins: 55,
            created_at: "2024-05-04T12:56:00Z",
            categories: [
              "Appetizers and Snacks",
              "Meat and Poultry",
              "Chicken",
            ],
          },
          {
            recipeid: 219109,
            userid: null,
            title: "Buffalo Chicken Wing Sauce",
            ingredients:
              "[\"2/3 cup hot pepper sauce (such as Frank's RedHot®)\", '1/2 cup cold unsalted butter', '1 1/2 tablespoons white vinegar', '1/4 teaspoon Worcestershire sauce', '1/4 teaspoon cayenne pepper', '1/8 teaspoon garlic powder', 'salt to taste']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/955573.jpg",
            calories: 104,
            rating: 4.69811,
            total_reviews: 490,
            season: "Any",
            daytimeofcooking: "Appetizer",
            veg_nonveg: "Non-Veg (Chicken)",
            total_mins: 10,
            created_at: "2024-05-04T12:55:55Z",
            categories: [
              "Side Dish",
              "Sauces and Condiments",
              "Sauces",
              "Wing Sauce",
            ],
          },
          {
            recipeid: 219110,
            userid: null,
            title: "Spicy Orange Chicken Wing Sauce",
            ingredients:
              "['1 cup orange marmalade', '1/3 cup rice vinegar', '1/4 cup hoisin sauce', '1 tablespoon soy sauce', '2 tablespoons Asian chile pepper sauce']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/763090.jpg",
            calories: 79,
            rating: 4.57534,
            total_reviews: 56,
            season: "Any",
            daytimeofcooking: "Appetizer",
            veg_nonveg: "Non-Veg (Chicken)",
            total_mins: 15,
            created_at: "2024-05-04T12:55:59Z",
            categories: [
              "Side Dish",
              "Sauces and Condiments",
              "Sauces",
              "Wing Sauce",
            ],
          },
          {
            recipeid: 219111,
            userid: null,
            title: "Spicy Honey Mustard Sauce",
            ingredients:
              "['1/3 cup mayonnaise', '2 tablespoons Dijon mustard', '2 teaspoons yellow mustard', '1 tablespoon rice vinegar', '2 tablespoons honey', '1/2 teaspoon hot sauce']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/4538583.jpg",
            calories: 58,
            rating: 4.73171,
            total_reviews: 35,
            season: "Any",
            daytimeofcooking: "Condiment",
            veg_nonveg: "Veg (Optional Egg)",
            total_mins: 5,
            created_at: "2024-05-04T12:56:01Z",
            categories: ["Side Dish", "Sauces and Condiments", "Sauces"],
          },
          {
            recipeid: 219112,
            userid: null,
            title: "Spicy Orange Bison Balls",
            ingredients:
              "['1 pound ground bison', '2 cloves garlic, minced', '1/2 cup plain breadcrumbs', '1 egg, beaten', '1/2 teaspoon Worcestershire sauce', '1 teaspoon salt', '1/2 teaspoon freshly ground black pepper', '1 tablespoon vegetable oil', '2 tablespoons Asian chile pepper sauce', '1/2 cup orange marmalade', '1 tablespoon soy sauce', '1/4 cup rice vinegar', '3 cups water']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1045229.jpg",
            calories: 308,
            rating: 4.31579,
            total_reviews: 15,
            season: "Any",
            daytimeofcooking: "Appetizer",
            veg_nonveg: "Non-Veg (Bison)",
            total_mins: 90,
            created_at: "2024-05-04T12:56:04Z",
            categories: ["Appetizers and Snacks", "Spicy"],
          },
          {
            recipeid: 219113,
            userid: null,
            title: "Amena's Triple Chocolate Chip Cookies",
            ingredients:
              "['1/2 cup unsalted butter', '1/2 cup white sugar', '1/4 cup packed light brown sugar', '1 large egg', '1/2 teaspoon vanilla extract', '1 1/8 cups all-purpose flour', '1/2 teaspoon salt', '1/2 teaspoon baking soda', '1/3 cup semi-sweet chocolate chips', '1/3 cup white chocolate chips', '1/3 cup milk chocolate chips']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/721425.jpg",
            calories: 182,
            rating: 4.60909,
            total_reviews: 85,
            season: "Any",
            daytimeofcooking: "Dessert",
            veg_nonveg: "Veg (Option to add Eggs & Dairy)",
            total_mins: 55,
            created_at: "2024-05-04T12:55:58Z",
            categories: [
              "Desserts",
              "Cookies",
              "Chocolate Chip Cookies",
              "White Chocolate",
            ],
          },
          {
            recipeid: 219116,
            userid: null,
            title: "Caramel Sea Salt Dark Chocolate Coins",
            ingredients:
              "['6 ounces dark chocolate, broken into small pieces', '1 tablespoon white sugar', '1/4 cup heavy cream', 'sea salt to taste', '1 tablespoon cocoa powder, for dusting']",
            img: "https://images.media-allrecipes.com/userphotos/560x315/1845467.jpg",
            calories: 49,
            rating: 4.3,
            total_reviews: 26,
            season: "Any",
            daytimeofcooking: "Dessert",
            veg_nonveg: "Veg (Optional Dairy)",
            total_mins: 85,
            created_at: "2024-05-04T12:56:03Z",
            categories: ["Desserts", "Chocolate", "Dark Chocolate"],
          },
        ];*/
        }
        setAllRecipes(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (!loading && allRecipes) {
      const categoriesSet = new Set();
      allRecipes.forEach((recipe) => {
        if (recipe.categories) {
          recipe.categories.forEach((cat) => categoriesSet.add(cat));
        }
      });
      const categoriesArray = Array.from(categoriesSet);
      setDistinctCategories(categoriesArray);
    }
  }, [allRecipes, loading]);

  const saveRecipe = (recipeId) => {
    if (!savedRecipes.includes(recipeId)) {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  const unsaveRecipe = (recipeId) => {
    setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
  };

  const isRecipeSaved = (recipeId) => {
    return savedRecipes.includes(recipeId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <RecipeContext.Provider
      value={{
        allRecipes,
        distinctCategories,
        saveRecipe,
        unsaveRecipe,
        isRecipeSaved,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export { RecipeContext, RecipeContextProvider };
