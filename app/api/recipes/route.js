import clientPromise from "../../../lib/mongodb";
import handleApiError from "../../components/ApiErrorHandler.js";
import { NextResponse } from "next/server";

/**
 * API route handler for fetching paginated recipes from the 'recipes' collection in MongoDB.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing query parameters for pagination.
 * @returns {Promise<void>} Sends a JSON response containing the paginated recipes or an error message.
 */
export async function GET(req) {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb"); // Connect to the 'devdb' database

    // Parse the 'page' and 'limit' query parameters from the URL, with defaults
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Fetch the paginated recipes from the collection
    const recipes = await db
      .collection("recipes")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    // Send a 200 (OK) response with the fetched recipes in JSON format
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    return handleApiError(NextResponse, error);
  }
}
