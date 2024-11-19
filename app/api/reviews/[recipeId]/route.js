import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

/**
 * Handles GET and POST requests for reviews associated with a specific recipe.
 * Updates the recipe's `averageRating` and `reviewCount` when a review is added, updated, or deleted.
 */

/**
 * GET handler for fetching all reviews of a specific recipe.
 * 
 * @param {Request} request - The HTTP request object.
 * @param {Object} params - Parameters passed to the route.
 * @param {string} params.recipeId - The ID of the recipe for which to fetch reviews.
 * @returns {Promise<NextResponse>} - A JSON response with the reviews or an error message.
 */
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const collection = db.collection('reviews');

    const { recipeId } = params;

    // Fetch reviews for the specified recipe, sorted by date in descending order.
    const reviews = await collection
      .find({ recipeId })
      .sort({ date: -1 })
      .project({ username: 1, date: 1, rating: 1, review: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews for recipe:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}


export async function POST(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');
    const recipesCollection = db.collection('recipes');

    const { recipeId } = params;
    const { username, rating, review } = await request.json();

    // Insert the new review into the reviews collection.
    await reviewsCollection.insertOne({
      recipeId,
      username,
      rating,
      review,
      date: new Date(),
    });

  
    const [aggregateData] = await reviewsCollection
      .aggregate([
        { $match: { recipeId } },
        {
          $group: {
            _id: '$recipeId',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    if (aggregateData) {
      const { averageRating, reviewCount } = aggregateData;

      await recipesCollection.updateOne(
        { _id: recipeId },
        { $set: { averageRating, reviewCount } }
      );
    }

    
  } catch (error) {
   
  }
}
