"use client";
import Link from "next/link";
import Loading from "../loading";
import { useEffect, useState } from "react";

export default function Favourites() {
  const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNkOTAxMjJlMDAzNzEwY2ViZjA4NmUiLCJlbWFpbCI6ImVsenplbHMyNUBnbWFpbC5jb20iLCJpYXQiOjE3MzIwODc4MzYsImV4cCI6MTczMjA5MTQzNn0.9Y7YZRm3lrBNuOnO04mrnzc0_0-ysQW7ntaBnqAlXdo";
  const [favourites, setFavourites] = useState([]);
  const [favouriteCount, setFavouriteCount] = useState(0);

  useEffect(() => {
    /* count favourties test */
    fetch("http://localhost:3000/api/favourites?action=count", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.count);
        setFavouriteCount(data.count);
      })
      .catch((error) => console.error("Error:", error));
  }, [favouriteCount]);

  async function addFavourite() {
    /* Add Favourite Test */
    const recipeId = "a71f9756-fd61-4514-977d-261e38345d55"; // Replace with the actual recipe ID

    fetch("http://localhost:3000/api/favourites", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Favourites</h1>
      </div>
      <div>
        <button onClick={addFavourite}>Add Favourite!</button>
      </div>
      {/* Carousel of Recommended Recipes */}
      <div className="relative mb-8">
        <div className="carousel-container overflow-hidden relative">
          <div className="carousel flex space-x-4">
            {favouriteCount > 0
              ? favourites.map((favourite) => (
                  <div
                    key={favourite._id}
                    className="carousel-item bg-white p-4 rounded-lg shadow-md w-80"
                  >
                    {/* Recipe Card */}
                    <image
                      src={favourite.image || "/default-image.jpg"}
                      alt={favourite.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold">{favourite.title}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-orange-500 font-semibold">
                        Rating: {favourite.rating} / 5
                      </span>
                    </div>
                    <Link href={`/recipes/${favourite._id}`} passHref>
                      <button className="mt-4 w-full py-2 bg-orange-500 text-white rounded-md">
                        View Recipe
                      </button>
                    </Link>
                  </div>
                ))
              : null}
          </div>
        </div>

        {/* Add navigation arrows for carousel */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white cursor-pointer">
          ←
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer">
          →
        </div>
      </div>
    </main>
  );
}
