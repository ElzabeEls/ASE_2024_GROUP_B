import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken"; // Ensure this is installed: npm install jsonwebtoken

export const dynamic = "force-dynamic";

/**
 * Ensures that the "favourites" collection exists in the database and creates it if it doesn't.
 * Also creates a unique index on the "userEmail" and "recipeId" fields.
 * @param {MongoDBDatabase} db - The MongoDB database instance.
 * @returns {Promise<void>}
 */
async function ensureFavouritesCollection(db) {
  const collections = await db.listCollections({ name: "favourites" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("favourites");
    await db
      .collection("favourites")
      .createIndex({ userEmail: 1, recipeId: 1 }, { unique: true });
  }
}

/**
 * Handles GET requests to the "/api/favourites" endpoint.
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} - A NextResponse object with the requested data or an error message.
 */
export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userEmail;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      console.error("Invalid JWT:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    const client = await clientPromise;
    const db = client.db("devdb");
    await ensureFavouritesCollection(db);

    if (action === "count") {
      const count = await db
        .collection("favourites")
        .countDocuments({ userEmail });
      return NextResponse.json({ count });
    } else {
      const favourites = await db
        .collection("favourites")
        .find({ userEmail })
        .sort({ created_at: -1 })
        .toArray();
      return NextResponse.json({ favourites });
    }
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return NextResponse.json(
      { error: "Error fetching favourites" },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to the "/api/favourites" endpoint.
 * Adds a new recipe to the user's favourites.
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} - A NextResponse object with a success or error message.
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userEmail;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      console.error("Invalid JWT:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { recipeId } = await request.json();

    const client = await clientPromise;
    const db = client.db("devdb");
    await ensureFavouritesCollection(db);

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    await db.collection("favourites").insertOne({
      userEmail,
      recipeId,
      created_at: new Date(),
    });

    return NextResponse.json({ message: "Recipe added to favourites" });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Recipe already in favourites" });
    }
    console.error("Error adding to favourites:", error);
    return NextResponse.json(
      { error: "Error adding to favourites" },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to the "/api/favourites" endpoint.
 * Removes a recipe from the user's favourites.
 * @param {IncomingMessage} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} - A NextResponse object with a success or error message.
 */
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userEmail;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      console.error("Invalid JWT:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { recipeId } = await request.json();

    const client = await clientPromise;
    const db = client.db("devdb");
    await ensureFavouritesCollection(db);

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const deleteResult = await db
      .collection("favourites")
      .deleteOne({ userEmail, recipeId });
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Favourite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recipe removed from favourites" });
  } catch (error) {
    console.error("Error removing from favourites:", error);
    return NextResponse.json(
      { error: "Error removing from favourites" },
      { status: 500 }
    );
  }
}