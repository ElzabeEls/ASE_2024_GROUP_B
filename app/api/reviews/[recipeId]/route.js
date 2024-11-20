import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb'; 

/**
 * Handles GET, POST, PUT, and DELETE requests for reviews associated with a specific recipe.
 * Updates the recipe's `averageRating` and `reviewCount` when a review is added, updated, or deleted.
 */

/**
 * GET handler for fetching all reviews of a specific recipe.
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
    console.error('Error fetching reviews for recipe:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

/**
 * POST handler for adding a new review to a recipe.
 */
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

    
    await updateRecipeStats(recipeId, db);

    return NextResponse.json({ success: true, message: 'Review added and recipe updated' });
  } catch (error) {
    console.error('Error adding review and updating recipe:', error);
    return NextResponse.json({ success: false, error: 'Failed to add review' }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');

    const { recipeId } = params;
    const { reviewId, updates } = await request.json();

    if (!reviewId || !updates) {
      return NextResponse.json({ success: false, error: 'Review ID and updates are required' }, { status: 400 });
    }

    
    await reviewsCollection.updateOne(
      { _id: new ObjectId(reviewId), recipeId },
      { $set: { ...updates, updatedAt: new Date() } }
    );

  
    await updateRecipeStats(recipeId, db);

    return NextResponse.json({ success: true, message: 'Review updated and recipe updated' });
  } catch (error) {
    console.error('Error updating review and recipe:', error);
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  
async function updateRecipeStats(recipeId, db) {
  const reviewsCollection = db.collection('reviews');
  const recipesCollection = db.collection('recipes');

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

    // Update the recipe document with the new values.
    await recipesCollection.updateOne(
      { _id: new ObjectId(recipeId) },
      { $set: { averageRating, reviewCount } }
    );
  }
}
