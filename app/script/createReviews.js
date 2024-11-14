const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: '.env.local' });

const url = process.env.MONGODB_URI;
if (!url) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}

const client = new MongoClient(url);

async function createReviews() {
  try {
    await client.connect();
    const db = client.db('devdb');
    const reviewsCollection = db.collection('reviews');
    const recipes = await db.collection('recipes').find().toArray();

    if (recipes.length === 0) {
      console.log("No recipes found in the database.");
      return;
    }

  

    for (const recipe of recipes) {
    
      const existingReviews = await reviewsCollection.find({ recipeId: recipe._id }).count();
      if (existingReviews > 0) {
        console.log(`Reviews already exist for recipe: ${recipe._id}`);
        continue;
      }

     

     
    }

    console.log("Reviews created successfully!");
  } catch (error) {
    console.error("Error creating reviews:", error);
  } finally {
    await client.close();
  }
}

createReviews();
