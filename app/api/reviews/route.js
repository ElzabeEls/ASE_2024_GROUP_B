export async function GET() {
  try {
    
    const client = await clientPromise;
    const db = client.db('devdb'); 
    const collection = db.collection('recipes');

  

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    
   
  }
}
