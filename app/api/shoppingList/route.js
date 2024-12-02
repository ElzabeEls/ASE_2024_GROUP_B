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
    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        message:
          "Invalid input data. Ensure 'userId' and 'items' are provided, and 'items' is a non-empty array.",
        status: 400,
      });
    }

    // Created a new shopping list entry
    const newShoppingList = {
      userId,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity || 1, // Default quantity to 1 if not provided
        purchased: item.purchased || false, // Default purchased status to false
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the shopping list into the database
    const result = await shoppingLists.insertOne(newShoppingList);
    if(!result){
      return NextResponse.json(
        {
          message: "No result. Please try again later.",
         status: 500}
      );
    }

    // Respond with success
    return NextResponse.json(
      {
        message: "Shopping list saved successfully",
       status: 201}
    );
  } catch (error) {
    console.error("Error saving shopping list:", error);
    return NextResponse.json(
      {
        message: "Failed to save shopping list. Please try again later.",
       status: 500}
    );
  }
}
