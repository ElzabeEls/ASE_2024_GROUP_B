import clientPromise from "../../../lib/mongodb";

/**
 * Handles a GET request to search for recipes in MongoDB using both full-text search and partial matching.
 * @param {Request} req - The incoming request, expected to contain a searchTerm query parameter.
 * @returns {Response} - A JSON response with search results or an error message.
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('searchTerm');

    if (!searchTerm) {
      return new Response(
        JSON.stringify({ success: false, error: "Search term is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db("devdb");

    /**
     * @description Executes a full-text search for the specified searchTerm.
     * @type {Promise<Array<Object>>} - Promise resolving to an array of matching recipes from the full-text search.
     */
    const textSearchPromise = db.collection("recipes")
      .find({ $text: { $search: searchTerm } })
      .toArray();

    /**
     * @description Executes a regex search on the title field for partial matches of the searchTerm, case-insensitive.
     * @type {Promise<Array<Object>>} - Promise resolving to an array of matching recipes from the regex search.
     */
    const regexSearchPromise = db.collection("recipes")
      .find({ title: { $regex: searchTerm, $options: 'i' } })
      .toArray();

    // Await both search results
    const [textResults, regexResults] = await Promise.all([textSearchPromise, regexSearchPromise]);

    /**
     * @description Combines and deduplicates results from both full-text and regex searches based on unique _id values.
     * @type {Array<Object>} - Array of unique recipe objects from combined search results.
     */
    const allResults = [...new Map([...textResults, ...regexResults].map(item => [item._id.toString(), item])).values()];

    // Checks if there are no matching results and return the required empty response
    if (allResults.length === 0) {
      return new Response(
        JSON.stringify({ message: "No matches found", data: [] }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, results: allResults, total: allResults.length }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Failed to perform search:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to perform search",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
