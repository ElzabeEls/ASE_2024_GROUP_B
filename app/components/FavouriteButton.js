"use client";

import React, { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";

export default function FavouriteButton({
  recipeId,
  initialIsFavourite = false,
  token
}) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleFavouriteClick = () => {
    if (isFavourite) {
      setShowConfirmDialog(true);
    } else {
      toggleFavourite();
    }
  };

  const toggleFavourite = async () => {
    if (!token) {
      setAlertMessage("Please log in to add favourites");
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`,
        {
          method: isFavourite ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipeId }),
        }
      );

      if (response.ok) {
        const newState = !isFavourite;
        setIsFavourite(newState);
        
        // Dispatch event to update favourite count
        window.dispatchEvent(new Event("favouritesUpdated"));
        
        setAlertMessage(
          newState ? "Added to favourites!" : "Removed from favourites"
        );
        setShowAlert(true);
      } else {
        throw new Error("Failed to update favourite");
      }
    } catch (error) {
      setAlertMessage("Error updating favourites");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <>
      <button
        onClick={handleFavouriteClick}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={
          isFavourite ? "Remove from favourites" : "Add to favourites"
        }
      >
        {isFavourite ? (
          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
        ) : (
          <HeartOff className="w-6 h-6" />
        )}
      </button>

      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Remove from Favourites?</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to remove this recipe from your favourites?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleFavourite();
                  setShowConfirmDialog(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-md">
          {alertMessage}
        </div>
      )}
    </>
  );
}