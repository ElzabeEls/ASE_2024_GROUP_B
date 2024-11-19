import clientPromise from "../../../lib/mongodb";

/**
 * API route handler for fetching all unique ingredients from the database.
 * It fetches the ingredients from the recipes collection and returns them in a structured format.
 *
 * @async
 * @function
 * @returns {Promise<void>} Sends a JSON response with the unique ingredients or an error message.
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("devdb");  // Replace with your actual database name

    // Fetch all recipes from the collection
    const recipes = await db.collection("recipes").find({}).toArray();

    // Initialize a set to store unique ingredient names
    const ingredientsSet = new Set();

    // Loop through each recipe and extract the ingredient names
    recipes.forEach(recipe => {
      if (recipe.ingredients) {
        // Add all ingredient names from the recipe to the set
        Object.keys(recipe.ingredients).forEach(ingredient => {
          ingredientsSet.add(ingredient);
        });
      }
    });

    // Convert the set to an array to return it in the response
    const ingredientsList = Array.from(ingredientsSet);

    // If no ingredients are found, return a meaningful message
    if (ingredientsList.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No ingredients found in the database",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the unique ingredients in a structured JSON response
    return new Response(
      JSON.stringify({
        success: true,
        ingredients: ingredientsList,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching ingredients:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch ingredients",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
