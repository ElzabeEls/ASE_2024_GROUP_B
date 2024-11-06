import clientPromise from "../../../../lib/mongodb";
import handleApiError from "../../../components/ApiErrorHandler";
import { NextResponse } from "next/server";

/**
 * API route handler for fetching recipes with an exact number of steps.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing the 'steps' query parameter.
 * @returns {Promise<void>} Sends a JSON response containing the filtered recipes or an error message.
 */
export async function GET(req) {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb"); // Connect to the 'devdb' database

    // Parse the 'steps' query parameter from the URL
    const url = new URL(req.url);
    const steps = parseInt(url.searchParams.get("steps"), 10);

    // Validate the 'steps' parameter
    if (isNaN(steps)) {
      return NextResponse.json(
        { error: 'Invalid number of steps' },
        { status: 400 }
      );
    }

    // Filter for recipes with the exact number of steps in 'instructions'
    const filter = { instructions: { $size: steps } };

    // Fetch the filtered recipes from the collection
    const recipes = await db
      .collection("recipes")
      .find(filter)
      .toArray();

    // Send a 200 (OK) response with the fetched recipes in JSON format
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    return handleApiError(NextResponse, error);
  }
}