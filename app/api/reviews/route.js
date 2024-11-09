import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request) {
  try {
    
    const client = await clientPromise;
    const db = client.db('devdb'); 
    const collection = db.collection('recipes'); 

    
    const url = new URL(request.url);
    const sortField = url.searchParams.get('sortField') || 'rating'; 
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    
  

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
