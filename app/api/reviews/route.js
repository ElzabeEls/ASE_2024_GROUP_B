import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

/**
 * Handles GET requests to fetch and sort reviews from the MongoDB database.
 *
 * @param {Request} request - The incoming request object containing the URL and query parameters.
 * @returns {Promise<Response>} - A JSON response with the sorted reviews data or an error message.
 */
export async function GET(request) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('devdb'); 
    const collection = db.collection('recipes'); 

    // Parse query parameters for sorting
    const url = new URL(request.url);
    const sortField = url.searchParams.get('sortField') || 'rating'; // Default to 'rating'
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1; // Default to descending

    // Fetch sorted reviews
    const reviews = await collection.find({})
      .sort({ [sortField]: sortOrder, submission_date: -1 }) // Sort by the chosen field and submission date
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
