import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

/**
 * Handles GET requests to fetch reviews for a specific recipe by its ID.
 * 
 * @async
 * @function GET
 * @param {Request} request - The HTTP request object.
 * @param {Object} context - The request context containing route parameters.
 * @param {string} context.params.recipeId - The ID of the recipe for which reviews are being fetched.
 * @returns {Promise<NextResponse>} - A response containing the reviews data or an error message.
 */
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const collection = db.collection('reviews');

    const { recipeId } = params;

    // Fetch reviews for the specified recipe, sorted by date in descending order.
    const reviews = await collection.find({ recipeId })
      .sort({ date: -1 })
      .project({ username: 1, date: 1, rating: 1, review: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews for recipe:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
