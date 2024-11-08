import clientPromise from "../../../lib/mongodb";
import handleApiError from "../../components/ApiErrorHandler"; 
import { NextResponse } from "next/server";

/**
 * API route handler for fetching recipes with optional filters such as pagination, search, category, and step count.
 *
 * @async
 * @function
 * @param {Object} req - The request object containing query parameters for filtering.
 * @returns {Promise<void>} Sends a JSON response containing the filtered recipes or an error message.
 */
export async function GET(req) {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb"); // Connect to the 'devdb' database

    // Parse query parameters from the URL, with defaults for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const steps = parseInt(url.searchParams.get("steps"), 10);

    console.log('url');
    console.log(url);

    console.log('page');
    console.log(page);
    console.log('limit' );
    console.log(limit );
    console.log("search");
    console.log(search);
    console.log("category");
    console.log(category);
    console.log("steps");
    console.log(steps);
    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline conditionally
    const pipeline = [];

    // Include the $match stage for search if 'search' is non-empty
    if (search.trim() !== "") {
      pipeline.push({
        $match: {
          title: new RegExp(`.*${search}.*`, "i"), // Case-insensitive regex match
        },
      });
    }

    // Include the $match stage for category if 'category' is non-empty
    if (category.trim() !== "") {
      pipeline.push({
        $match: {
          category: new RegExp(`.*${category}.*`, "i"), // Case-insensitive regex match
        },
      });
    }

    // Include the $match stage for exact step count if 'steps' is provided
    if (!isNaN(steps)) {
      pipeline.push({
        $match: {
          instructions: { $size: steps },
        },
      });
    }

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Fetch the filtered recipes from the collection
    const recipesCursor = db.collection("recipes").aggregate(pipeline, {
      maxTimeMS: 60000,
      allowDiskUse: true,
    });

    // Convert the cursor to an array
    const recipes = await recipesCursor.toArray();

    // Send a 200 (OK) response with the fetched recipes in JSON format
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    return handleApiError(NextResponse, error);
  }
}
