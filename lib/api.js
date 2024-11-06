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
export async function fetchRecipes(page = 1, limit = 20, search = "") {
  const queryString = new URLSearchParams({ page, limit, search: search }).toString();

  try {

    console.log("`${process.env.BASE_URL}/api/recipes?${queryString}`")
    console.log(`${process.env.BASE_URL}/api/recipes?${queryString}`)

    // Construct the URL with page and limit query parameters
    const response = await fetch(`${process.env.BASE_URL}/api/recipes?${queryString}`);
  
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch recipes");
    }

console.log("response")
console.log(response)
    // Parse and return the response data
    const data = await response.json();
   
    return data.recipes;
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
    console.log("Fetching product from URL:", `${process.env.BASE_URL}/api/recipe/${id}`);

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

export async function searchRecipes(query, page = 1) {
  console.log("query")
  console.log(query)
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/search?search=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    console.log("response.data")
    console.log(response.data)
    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [], totalPages: 0 };
  }
}