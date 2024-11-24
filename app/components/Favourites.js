"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNkOTAxMjJlMDAzNzEwY2ViZjA4NmUiLCJlbWFpbCI6ImVsenplbHMyNUBnbWFpbC5jb20iLCJpYXQiOjE3MzIwODc4MzYsImV4cCI6MTczMjA5MTQzNn0.9Y7YZRm3lrBNuOnO04mrnzc0_0-ysQW7ntaBnqAlXdo";

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!jwt) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/favourites", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavourites(data.favourites);
          setFavouriteCount(data.favourites.length);
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [router, jwt]);

  async function addFavourite() {
    const recipeId = "a71f9756-fd61-4514-977d-261e38345d55"; // Replace with actual recipe ID
    try {
      const response = await fetch("http://localhost:3000/api/favourites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavourites((prev) => [...prev, data]);
        setFavouriteCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  }

  const handleFavoriteChange = (recipeId) => {
    setFavourites(favourites.filter((fav) => fav.recipe._id !== recipeId));
    setFavouriteCount((prevCount) => prevCount - 1);
    window.dispatchEvent(new Event("favouritesUpdated"));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

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
                    <img
                      src={favourite.recipe.images[0] || "/default-recipe-image.jpg"}
                      alt={favourite.recipe.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold">{favourite.recipe.title}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-orange-500 font-semibold">
                        Rating: {favourite.recipe.rating} / 5
                      </span>
                    </div>
                    <Link href={`/recipes/${favourite.recipe._id}`} passHref>
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

      {/* Grid of Favorite Recipes */}
      {favourites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven&apos;t added any favourites yet.</p>
          <Link href="/recipe" className="text-blue-500 hover:underline">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((favorite) => (
            <div key={favorite._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={favorite.recipe.images[0] || "/default-recipe-image.jpg"}
                  alt={favorite.recipe.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{favorite.recipe.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Added on {new Date(favorite.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/recipes/${favorite.recipe._id}`}
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