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
    const sortBy = url.searchParams.get("sortBy") || "title";
    const sortOrder = url.searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const steps = parseInt(url.searchParams.get("steps"), 10);

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
          category: new RegExp(category, "i"), // Case-insensitive category match
        },
      });
    }

    if (!isNaN(steps)) {
      pipeline.push({
        $match: {
          instructions: { $size: steps },
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


// import clientPromise from "../../../lib/mongodb";
// import { NextResponse } from "next/server";

// /**
//  * API route handler for fetching paginated recipes from the 'recipes' collection in MongoDB.
//  *
//  * @async
//  * @function
//  * @param {Object} req - The request object containing query parameters for pagination.
//  * @returns {Promise<void>} Sends a JSON response containing the paginated recipes or an error message.
//  */
// export async function GET(req) {
//   console.log("Hello!");
//   try {
//     // Await the MongoDB client connection
//     const client = await clientPromise;
//     const db = client.db("devdb"); // Connect to the 'devdb' database

//     // Parse the 'page', 'limit', 'search', 'category', 'sortBy', and 'sortOrder' query parameters from the URL, with defaults
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "20", 10);
//     const search = url.searchParams.get("search") || "";
//     const category = url.searchParams.get("category") || "";
//     const sortBy = url.searchParams.get("sortBy") || "title"; // Default sort field
//     const sortOrder = url.searchParams.get("sortOrder") === "desc" ? -1 : 1; // Default to ascending

//     console.log('url');
//     console.log(url);

//     console.log('page');
//     console.log(page);
//     console.log('limit');
//     console.log(limit);
//     console.log("search");
//     console.log(search);
//     console.log("category");
//     console.log(category);
//     console.log("sortBy");
//     console.log(sortBy);
//     console.log("sortOrder");
//     console.log(sortOrder);

//     // Calculate the number of documents to skip for pagination
//     const skip = (page - 1) * limit;

//     // Build the aggregation pipeline conditionally
//     const pipeline = [];

//     // Include the $match stage only if 'search' is a non-empty string
//     if (search.trim() !== "") {
//       pipeline.push({
//         $match: {
//           title: new RegExp(`.*${search}.*`, "i"), // Case-insensitive regex match
//         },
//       });
//     }

//     // Include the $match stage only if 'category' is a non-empty string
//     if (category.trim() !== "") {
//       pipeline.push({
//         $match: {
//           category: new RegExp(`.*${category}.*`, "i"), // Case-insensitive regex match
//         },
//       });
//     }

//     // Include the $sort stage based on 'sortBy' and 'sortOrder' parameters
//     pipeline.push({ $sort: { [sortBy]: sortOrder } });

//     // Add pagination stages
//     pipeline.push({ $skip: skip }, { $limit: limit });

//     // Fetch the paginated recipes from the collection
//     const recipesCursor = db.collection("recipes").aggregate(pipeline, {
//       maxTimeMS: 60000,
//       allowDiskUse: true,
//     });

//     // Convert the cursor to an array
//     const recipes = await recipesCursor.toArray();

//     // Send a 200 (OK) response with the fetched recipes in JSON format
//     return NextResponse.json({ recipes }, { status: 200 });
//   } catch (error) {
//     return handleApiError(NextResponse, error);
//   }
// }
