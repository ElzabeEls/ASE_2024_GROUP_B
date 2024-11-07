import clientPromise from "../../../lib/mongodb";
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
  console.log("Hello!");
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb"); // Connect to the 'devdb' database

    // Parse the 'page', 'limit', and 'search' query parameters from the URL, with defaults
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const tags = url.searchParams.get("tags") ? url.searchParams.get("tags").split(",").map(tag => tag.trim()) : [];

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
    console.log("tags");
    console.log(tags);

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline conditionally
    const pipeline = [];

    // Include the $match stage only if 'search' is a non-empty string
    if (search.trim() !== "") {
      pipeline.push({
        $match: {
          title: new RegExp(`.*${search}.*`, "i"), // Case-insensitive regex match
        },
      });
    }

    // Include the $match stage only if 'category' is a non-empty string
    if (category.trim() !== "") {
      pipeline.push({
        $match: {
          category: new RegExp(`.*${category}.*`, "i"), // Case-insensitive regex match
        },
      });
    }

    // Include the $match stage for tags if any tags are provided
    if (tags.length > 0) {
  pipeline.push({
    $match: {
      tags: { $in: tags.map(tag => new RegExp(tag, 'i')) }, // Case-insensitive match
    },
  });
}

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Fetch the paginated recipes from the collection
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
