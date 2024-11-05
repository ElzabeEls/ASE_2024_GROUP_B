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

    // Perform a full-text search and a regex search simultaneously
    const textSearchPromise = db.collection("recipes")
      .find({ $text: { $search: searchTerm } })
      .toArray();

    const regexSearchPromise = db.collection("recipes")
      .find({ title: { $regex: searchTerm, $options: 'i' } })
      .toArray();

    // Await both search results
    const [textResults, regexResults] = await Promise.all([textSearchPromise, regexSearchPromise]);

    // Combine and deduplicate results
    const allResults = [...new Map([...textResults, ...regexResults].map(item => [item._id.toString(), item])).values()];

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
