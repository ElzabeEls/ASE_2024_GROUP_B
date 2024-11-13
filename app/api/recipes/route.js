import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to fetch paginated and filtered recipes.
 *
 * @async
 * @function GET
 * @param {Object} req - The request object containing query parameters for pagination and filters.
 * @returns {Promise<void>} Sends a JSON response containing the paginated recipes or an error message.
 */
export async function GET(req) {
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb");

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const tags = url.searchParams.get("tags") ? url.searchParams.get("tags").split(",").map(tag => tag.trim()) : [];
    const steps = parseInt(url.searchParams.get("steps") || "", 10);
    console.log("tags");
    console.log(tags);
    const sortBy = url.searchParams.get("sortBy") || "title";
    const sortOrder = url.searchParams.get("sortOrder") === "desc" ? -1 : 1;
  

    // Calculate pagination offsets
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline conditionally
    const pipeline = [];

    if (search.trim()) {
      pipeline.push({
        $match: {
          title: new RegExp(search, "i"), // Case-insensitive search
        },
      });
    }

    if (category.trim()) {
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

    pipeline.push(
      { $sort: { [sortBy]: sortOrder } }, // Apply sorting
      { $skip: skip }, // Pagination: skip documents
      { $limit: limit } // Pagination: limit documents
    );

    // Execute the aggregation query
    const recipesCursor = db.collection("recipes").aggregate(pipeline, {
      maxTimeMS: 60000,
      allowDiskUse: true,
    });

    const recipes = await recipesCursor.toArray();

    // Handle empty results
    if (recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes found with the specified filters." },
        { status: 200 }
      );
    }

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching recipes." },
      { status: 500 }
    );
  }
}