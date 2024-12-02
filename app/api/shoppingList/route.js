import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const dbClient = await clientPromise;
    const db = dbClient.db("devdb");
    const shoppingLists = db.collection("shopping_lists");

    // Parse the incoming JSON data
    const { userId, items } = await req.json();

    // Validate the input
    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some((item) => !item.name)
    ) {
      return NextResponse.json(
        {
          message: "Invalid input data. Each item must have a 'name'.",
        },
        { status: 400 }
      );
    }

    // Check if a shopping list already exists for this user
    const existingList = await shoppingLists.findOne({ userId });
    if (existingList) {
      return NextResponse.json(
        { message: "Shopping list for this user already exists." },
        { status: 409 }
      );
    }

    // Create a new shopping list entry
    const newShoppingList = {
      userId,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity || 1, // Default quantity to 1
        purchased: item.purchased || false, // Default purchased status to false
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the shopping list into the database
    const result = await shoppingLists.insertOne(newShoppingList);

    // Respond with success
    return NextResponse.json(
      { message: "Shopping list saved successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving shopping list:", error);
    return NextResponse.json(
      {
        message: "Failed to save shopping list. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
