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
  console.log("hello")
  console.log("req")
  console.log(req)
  try {
    // Await the MongoDB client connection
    const client = await clientPromise;
    const db = client.db("devdb"); // Connect to the 'devdb' database

    // Parse the 'page' and 'limit' query parameters from the URL, with defaults
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = parseInt(url.searchParams.get("search") || "");

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Fetch the paginated recipes from the collection
    const recipes = await db
      .collection("recipes")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

console.log("recipes")
console.log(recipes)

    // Send a 200 (OK) response with the fetched recipes in JSON format
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
    return handleApiError(NextResponse, error);
  }
}


// import { NextResponse } from "next/server";
// import clientPromise from "../../../lib/mongodb";

// /**
//  * Handles the GET request to search for recipes in the database.
//  * 
//  * This function searches for recipes in the MongoDB `recipes` collection using a provided search term.
//  * It first performs a full-text search. If no results are found, it falls back to a case-insensitive 
//  * regex search on the `title` field.
//  *
//  * @async
//  * @function GET
//  * @param {Request} req - The incoming request object.
//  * @returns {Promise<Response>} - A Response object containing the search results or an error message.
//  */

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const searchParams = url.searchParams.get("search");
//     const skip = url.searchParams.get("skip");

//     console.log('search', search);
//     console.log('skip', skip);

//     // Check if required parameters are missing
//     if (!searchParams) {
//       return NextResponse.json({ message: "Missing parameter searchParams", status: 400 });
//     }
//     if (!skip) {
//       return NextResponse.json({ message: "Missing parameter skip", status: 400 });
//     }


//     const client = await clientPromise;


//     const filter = {
//       'title': new RegExp('.chocolate.', 'i')
//     };
    
//     const coll = client.db('devdb').collection('recipes');
//     const cursor = coll.find(filter);
//     const result = await cursor.toArray();
//     await client.close();



//     if (!result) {
//       return NextResponse.json({ message: "No results found", status: 404 });
//     }
// console.log("result")
// console.log(result)
//     return NextResponse.json({ message: "ok", status: 200, data: result });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Internal Server Error", status: 500 });
//   }
// }

