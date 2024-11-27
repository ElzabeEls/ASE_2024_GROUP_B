"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Favourites({ recipes }) {
  const [favourites, setFavourites] = useState(recipes);
  const [favouriteCount, setFavouriteCount] = useState(0);

  async function addFavourite() {
    const recipeId = "a71f9756-fd61-4514-977d-261e38345d55"; // Replace with actual recipe ID
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipeId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFavourites((prev) => [...prev, data]);
        setFavouriteCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error adding favourite:", error);
    }
  }

  /*
  const handleFavouriteChange = (recipeId) => {
    setFavourites(favourites.filter((fav) => fav.recipe._id !== recipeId));
    setFavouriteCount((prevCount) => prevCount - 1);
    window.dispatchEvent(new Event("favouritesUpdated"));
  };
*/

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Favourites</h1>
        <button
          onClick={addFavourite}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Favourite!
        </button>
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
                    <Image
                      width={1000}
                      height={1000}
                      src={favourite.images[0] || "/default-recipe-image.jpg"}
                      alt={favourite.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold">{favourite.title}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-orange-500 font-semibold">
                        Rating: {favourite.recipe.rating} / 5
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
      </div>

      {/* Grid of Favourite Recipes */}
      {favourites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            You haven&apos;t added any favourites yet.
          </p>
          <Link href="/recipe" className="text-blue-500 hover:underline">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((favourite) => (
            <div
              key={favourite._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <Image
                  width={1000}
                  height={1000}
                  src={favourite.images[0] || "/default-recipe-image.jpg"}
                  alt={favourite.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {favourite.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Added on {new Date(favourite.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/recipes/${favourite._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
