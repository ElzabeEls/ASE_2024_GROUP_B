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
    const db = client.db("devdb");

    // Parse the 'page', 'limit', 'search', 'category', and 'steps' query parameters from the URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const tags = url.searchParams.get("tags") ? url.searchParams.get("tags").split(",").map(tag => tag.trim()) : [];
    const steps = parseInt(url.searchParams.get("steps") || "", 10);
    const topRated = url.searchParams.get("top-rated") === "true"; // Check if requesting top-rated recipes
    console.log("tags");
    console.log(tags);

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Build the aggregation pipeline conditionally based on the provided filters
    const pipeline = [];

    if (topRated) {
      // Top-rated recipes aggregation
      pipeline.push(
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "recipeId",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
          },
        },
        {
          $sort: { averageRating: -1 }, // Sort by average rating in descending order
        },
        {
          $limit: 10, // Limit to top 10 recipes
        },
        {
          $project: {
            title: 1,
            category: 1,
            averageRating: 1,
            tags: 1,
          },
        }
      );
    } else {
      // Regular paginated recipes with filters
      if (search.trim() !== "") {
        pipeline.push({
          $match: {
            title: new RegExp(search, "i"),
          },
        });
      }
      // Add the category filter if a 'category' is provided

      if (category.trim() !== "") {
        pipeline.push({
          $match: {
            category: new RegExp(`.*${category}.*`, "i"),
          },
        });
      }
      // Include the $match stage for tags if any tags are provided

      if (tags.length > 0) {
        pipeline.push({
          $match: {
            tags: { $in: tags.map(tag => new RegExp(tag, "i")) },
          },
        });
      }
      if (!isNaN(steps)) {
        console.log("Adding steps filter:", steps)
        pipeline.push({
          $match: {
            steps: steps,
          },
        });
      }
      // Add pagination to the pipeline
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    // Execute the aggregation query to fetch recipes
    const recipesCursor = db.collection("recipes").aggregate(pipeline, {
      maxTimeMS: 60000,
      allowDiskUse: true,
    });

    // Convert the cursor to an array
    const recipes = await recipesCursor.toArray();

    if (recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes found with the specified filters." },
        { status: 200 }
      );
    }

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    // Handle any errors during the process
    return handleApiError(NextResponse, error);
  }
}