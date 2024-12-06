"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Favourites({ recipes, token }) {
  const [favourites, setFavourites] = useState(recipes);
  const [favouriteCount, setFavouriteCount] = useState(recipes.length);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recipeToRemove, setRecipeToRemove] = useState(null);

  // Function to remove recipe from favourites
  const handleRemoveFavourite = async () => {
    if (!recipeToRemove) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites/${recipeToRemove._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove the recipe from the state and update the count
        setFavourites((prevFavourites) =>
          prevFavourites.filter((fav) => fav._id !== recipeToRemove._id)
        );
        setFavouriteCount((prevCount) => prevCount - 1);
        setShowConfirmDialog(false); // Close confirmation dialog
        setRecipeToRemove(null); // Reset selected recipe
      } else {
        console.error("Failed to remove recipe from favourites:", await response.text());
        alert("Failed to remove recipe. Please try again.");
      }
    } catch (error) {
      console.error("Error removing favourite:", error);
      alert("An error occurred while removing the recipe. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-2xl font-bold text-center">Favourites</h1>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Remove from Favourites?</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to remove this recipe from your favourites?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setRecipeToRemove(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveFavourite}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

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
              className="bg-[var(--card-bg)] rounded-lg overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[var(--hover-shadow)] p-4 max-w-xs mx-auto"
            >
              <div className="relative">
                <Image
                  width={500}
                  height={500}
                  src={favourite.images[0] || "/default-recipe-image.jpg"}
                  alt={favourite.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <p className="text-[var(--text-muted)] text-xs mt-1">
                Added on {new Date(favourite.createdAt).toLocaleDateString()}
              </p>
              <div className="p-4">
                <h3 className="text-[var(--text-heading)] font-bold text-xl line-clamp-2">
                  {favourite.title}
                </h3>

                <div className="flex items-center justify-between mt-3 p-4">
                  <p className="flex flex-col items-center text-[var(--prep-time-color)] flex-grow text-center">
                    {favourite.prep} mins
                  </p>
                  <p className="flex flex-col items-center text-[var(--prep-time-color)] flex-grow text-center">
                    {favourite.cook} mins
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Link
                    href={`/recipes/${favourite._id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View Recipe
                  </Link>
                  <button
                    onClick={() => {
                      setRecipeToRemove(favourite);
                      setShowConfirmDialog(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove from Favourites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
