import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import handleApiError from "../../components/ApiErrorHandler"; // Assuming error handler is required

/**
 * API route handler for fetching paginated recipes from the 'recipes' collection in MongoDB.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing query parameters for pagination and filters.
 * @returns {Promise<void>} Sends a JSON response containing the paginated recipes or an error message.
 */
export async function GET(req) {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb"); // Connect to the 'devdb' database

    // Parse the 'page', 'limit', 'search', 'category', and 'steps' query parameters from the URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const steps = parseInt(url.searchParams.get("steps") || "", 10); // Parse steps if provided

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline conditionally based on the provided filters
    const pipeline = [];

    // Add the search filter if a 'search' term is provided
    if (search.trim() !== "") {
      pipeline.push({
        $match: {
          title: new RegExp(search, "i"), // Case-insensitive regex match
        },
      });
    }

    // Add the category filter if a 'category' is provided
    if (category.trim() !== "") {
      pipeline.push({
        $match: {
          category: new RegExp(category, "i"), // Case-insensitive regex match
        },
      });
    }

    // Add the step filter if 'steps' is provided and valid
    if (!isNaN(steps)) {
      pipeline.push({
        $match: {
          instructions: { $size: steps }, // Filter by the exact number of steps
        },
      });
    }

    // Add pagination to the pipeline
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute the aggregation query to fetch recipes
    const recipesCursor = db.collection("recipes").aggregate(pipeline, {
      maxTimeMS: 60000,
      allowDiskUse: true,
    });

    // Convert the cursor to an array
    const recipes = await recipesCursor.toArray();

    // Return the filtered and paginated recipes as a JSON response
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    // Handle any errors during the process
    return handleApiError(NextResponse, error);
  }
}
