import clientPromise from "../../../lib/mongodb";

/**
 * API route handler for fetching recipes filtered by multiple tags.
 * Supports "match any" (OR) and "match all" (AND) filtering.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing query parameters.
 * @returns {Promise<void>} Sends a JSON response with filtered recipes or an error message.
 */
export async function GET(req) {
  try {
    // Await MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb");

    // Parse query parameters from the URL
    const url = new URL(req.url);
    const tags = url.searchParams.get("tags")?.split(",") || []; // Array of tags from query
    const matchAll = url.searchParams.get("matchAll") === "true"; // Flag to match all tags

    // Construct the filter based on match type
    let filter = {};
    if (tags.length > 0) {
      filter = matchAll
        ? { tags: { $all: tags } } // Match all tags
        : { tags: { $in: tags } }; // Match any tag
    }

    // Fetch recipes with the filter applied
    const recipes = await db.collection("recipes").find(filter).toArray();

    // Return successful response with the filtered recipes
    return new Response(JSON.stringify({ success: true, recipes }), { status: 200 });
  } catch (error) {
    // Log and return error response
    console.error("Failed to fetch filtered recipes:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch filtered recipes",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 }
    );
  }
}
