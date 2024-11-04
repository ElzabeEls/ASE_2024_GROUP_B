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
      
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
