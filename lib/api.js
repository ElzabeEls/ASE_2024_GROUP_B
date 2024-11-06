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
 * @param {number} [steps] - Optional number of steps to filter recipes by.
 * @returns {Promise<Object>} - A promise that resolves to an array of recipe objects if successful, or an error message if failed.
 */
export async function fetchRecipes(page = 1, limit = 20, steps, tags) {
  try {
    // Construct the URL with page, limit, steps, and tags query parameters
    const url = new URL(`${process.env.BASE_URL}/api/recipes`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (steps) {
      url.searchParams.append("steps", steps);
    }
    if (tags && tags.length > 0) {
      url.searchParams.append("tags", tags.join(","));
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch recipes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching recipes: ${error.message}`);
    return { error: `Error fetching recipes: ${error.message}` };
  }
}
