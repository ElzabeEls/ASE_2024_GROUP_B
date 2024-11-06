import clientPromise from "../../../lib/mongodb";

/**
 * API route handler for fetching recipes filtered by multiple tags with pagination.
 * Supports "match any" (OR) and "match all" (AND) filtering, along with limit and page for pagination.
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
    const tags = url.searchParams.get("tags")?.split(",").map((tag) => tag.trim()) || [];
    const matchAll = url.searchParams.get("matchAll") === "true";
    const limit = parseInt(url.searchParams.get("limit")) || 20; // Default limit of 10
    const page = parseInt(url.searchParams.get("page")) || 1;    // Default to first page

    // Construct the filter for exact string matching
    const filter = tags.length > 0
      ? matchAll
        ? { tags: { $all: tags } } // Match all tags exactly
        : { tags: { $in: tags } }  // Match any tag exactly
      : {}; // No filter if no tags

    // Log the constructed filter for debugging
    console.log("Filter being used:", filter);

    // Fetch recipes with the filter, limit, and skip for pagination
    const recipes = await db.collection("recipes")
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit) // Calculate skip based on page
      .toArray();

    // Return successful response with filtered and paginated recipes
    return new Response(JSON.stringify({ success: true, recipes, page, limit }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log and return error response
    console.error("Failed to fetch filtered recipes:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch filtered recipes",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
