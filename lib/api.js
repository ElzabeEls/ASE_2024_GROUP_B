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
 * @param {string} search - The search term for filtering recipes (optional).
 * @param {string} category - The category for filtering recipes (optional).
 * @param {string} steps - The number of steps to filter by (optional).
 * @returns {Promise<Object>} - A promise that resolves to an array of recipe objects if successful, or an error message if failed.
 */
export async function fetchRecipes(
  page = 1,
  limit = 20,
  search = "",
  category = "",
  steps = ""
) {
  try {
    // Construct the URL
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes`);

    // Append query parameters only if they are defined
    if (page !== undefined) {
      url.searchParams.append("page", page);
    }
    if (limit !== undefined) {
      url.searchParams.append("limit", limit);
    }
    if (search) {
      url.searchParams.append("search", search);
    }
    if (category) {
      url.searchParams.append("category", category);
    }
    if (steps) {
      url.searchParams.append("steps", steps); // Filter by steps if provided
    }

    console.log("url:", url); // Log the constructed URL

    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch recipes");
    }

    const data = await response.json();
    return data.recipes;
  } catch (error) {
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
 */
export async function fetchProductById(id) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe/${id}`;
    // console.log("Fetching product from URL:", url);  // Log URL being fetched

    const response = await fetch(url);
    console.log("Response status:", response.status); // Log response status

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData); // Log error details if response is not OK
      throw new Error(errorData.message || "Failed to fetch product");
    }

    const data = await response.json();
    //  console.log("Fetched product data:", data);  // Log fetched data
    return data;
  } catch (error) {
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
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    }/api/categories`;
    //console.log("Fetching categories from URL:", url);  // Log URL being fetched

    const response = await fetch(url);
    console.log("Response status:", response.status); // Log response status

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData); // Log error details if response is not OK
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Fetched categories data:", data); // Log fetched data
    return data;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return { error: `Error fetching categories: ${error.message}` };
  }
}
