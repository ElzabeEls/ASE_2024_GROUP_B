/**
 * Handles GET requests to search for recipes in the MongoDB collection.
 * 
 * @param {Request} request - The request object containing the search query.
 * @returns {Response} A response object containing the search results or an error message.
 * @throws {Error} If there is an error during the database search operation.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';

    // Use a more complex search query here if needed
    const results = await collection.find({ $text: { $search: searchQuery } }).toArray();

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
