import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
  try {


    const { recipeId } = params;

    
    const reviews = await collection.find({ recipeId })
      

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews for recipe:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
