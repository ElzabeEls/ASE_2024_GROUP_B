import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken"; // Install this if not already: npm install jsonwebtoken

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ count: 0 }); // No authorization header provided
    }

    const token = authHeader.split(" ")[1]; // Assuming format: "Bearer <token>"
    if (!token) {
      return NextResponse.json({ count: 0 }); // No token in the authorization header
    }

    let userEmail;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
      userEmail = decoded.email;
    } catch (err) {
      console.error("Invalid JWT:", err);
      return NextResponse.json({ count: 0 }); // Invalid JWT
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    const client = await clientPromise;
    const db = client.db("devdb");

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

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ count: 0 }); // No authorization header provided
    }

    const token = authHeader.split(" ")[1]; // Assuming format: "Bearer <token>"
    if (!token) {
      return NextResponse.json({ count: 0 }); // No token in the authorization header
    }

    const { recipeId } = await request.json();
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
    const userEmail = decoded.email; // Declare userEmail here

    console.log("userEmail");
    console.log(userEmail);

    const client = await clientPromise;
    const db = client.db("devdb");

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

export async function DELETE(request) {
  try {
    const { recipeId } = await request.json();
    const userEmail = session.user.email;

    const client = await clientPromise;
    const db = client.db("devdb");

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
