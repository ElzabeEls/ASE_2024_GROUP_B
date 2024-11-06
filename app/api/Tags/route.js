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
    const client = await clientPromise;
    const db = client.db("devdb");

    // Parse query parameters from the URL
    const url = new URL(req.url);
    const tags = url.searchParams.get("tags")?.split(",").map((tag) => tag.trim()) || [];
    const matchAll = url.searchParams.get("matchAll") === "true";
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const page = parseInt(url.searchParams.get("page")) || 1;

    // Construct the filter for matching tags
    const filter = tags.length > 0
      ? matchAll
        ? { tags: { $all: tags } }
        : { tags: { $in: tags } }
      : {};

    // Fetch recipes with filter, limit, and skip (pagination)
    const recipes = await db.collection("recipes")
      .find(filter, { projection: { tags: 1 } }) // Ensure 'tags' are included
      .limit(limit)
      .skip((page - 1) * limit)
      .toArray();

    // Return the filtered and paginated recipes
    return new Response(JSON.stringify({ success: true, recipes, page, limit }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch recipes",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
