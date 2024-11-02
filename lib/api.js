/**
 * Fetches paginated recipes from the '/api/recipes' endpoint.
 *
 * This function sends a GET request with pagination parameters to retrieve recipe data.
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchRecipes
 * @param {number} page - The page number to fetch (default is 1).
 * @param {number} limit - The number of recipes per page (default is 20).
 * @returns {Promise<Object>} - A promise that resolves to an array of recipe objects if successful, or an error message if failed.
 */
export async function fetchRecipes(page = 1, limit = 20) {
  try {
    // Construct the URL with page and limit query parameters
    const response = await fetch(
      `${process.env.BASE_URL}/api/recipes?page=${page}&limit=${limit}`
    );

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch recipes");
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle and return any errors that occur during the fetch
    console.error(`Error fetching recipes: ${error.message}`);
    return { error: `Error fetching recipes: ${error.message}` };
  }
}

/**
 * Fetches a single product by its ID from the '/api/products/[id]' endpoint.
 *
 * This function sends a GET request to the API to retrieve product data based on the provided ID
 * and returns it as a JSON object. If the request fails, it returns an error message.
 *
 * @async
 * @function fetchProductById
 * @param {string} id
 * @returns {Promise<Object|string>}
 * @throws {Error}
 *
 * @example
 * fetchProductById('12345')
 *   .then(product => {
 *     console.log(product); // Logs the product data
 *   })
 *   .catch(error => {
 *     console.error(error); // Logs the error message
 *   });
 */
export async function fetchProductById(id) {
  try {
    // Log the URL being fetched
    console.log(
      "Fetching product from URL:",
      `${process.env.BASE_URL}/api/recipe/${id}`
    );

    // Make API request to fetch the product by its ID from your endpoint
    const response = await fetch(`${process.env.BASE_URL}/api/recipe/${id}`);

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch product");
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle and return any errors that occur during the fetch
    console.error(`Error fetching product: ${error.message}`);
    return { error: `Error fetching product: ${error.message}` };
  }
}

/**
 * Fetches categories from the '/api/categories' endpoint.
 *
 * This function sends a GET request to retrieve category data.
 * If the request fails, it returns an error message.
 *
 * @async
 * @function fetchCategories
 * @returns {Promise<Object>} - A promise that resolves to an array of category objects if successful, or an error message if failed.
 */
export async function fetchCategories() {
  try {
    // Log the base URL and endpoint being fetched
    const url = `${process.env.BASE_URL}/api/categories`;
    console.log("Fetching categories from URL:", url);

    // Make API request to fetch categories from your endpoint
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle and return any errors that occur during the fetch
    console.error(`Error fetching categories: ${error.message}`);
    return { error: `Error fetching categories: ${error.message}` };
  }
}