import clientPromise from "../../../lib/mongodb";

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

  
    const textResults = await db.collection("recipes")
      .find({ $text: { $search: searchTerm } })
      .toArray();

    
    let regexResults = [];
    if (textResults.length === 0) {
      regexResults = await db.collection("recipes")
        .find({ title: { $regex: searchTerm, $options: 'i' } })
        .toArray();
    }

    const results = [...new Set([...textResults, ...regexResults])];

    return new Response(
      JSON.stringify({ success: true, results, total: results.length }),
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