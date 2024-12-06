import React, { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";

export default function FavouriteButton({
  recipeId,
  initialIsFavourite = false,
  token,
  onFavouriteChange
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
      const response = await fetch("/api/favourites", {
        method: isFavourite ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });
  
      if (response.ok) {
        const newState = !isFavourite;
        setIsFavourite(newState);
  
        // Optional callback for parent components
        if (onFavouriteChange) {
          onFavouriteChange(newState);
        }
  
        // Dispatch custom event to update count
        window.dispatchEvent(new Event("favouritesUpdated"));
  
        setAlertMessage(
          newState ? "Recipe added to favourites!" : "Recipe removed from favourites!"
        );
      } else {
        throw new Error("Failed to update favourites");
      }
    } catch (error) {
      console.error("Error updating favourites:", error);
      setAlertMessage("Something went wrong. Please try again.");
    } finally {
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
      
      <button
        onClick={handleFavouriteClick}
        className="rounded-full p-2 hover:bg-gray-100 transition"
        aria-label={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
      >
        {isFavourite ? (
          <Heart fill="red" color="red" className="w-6 h-6" />
        ) : (
          <HeartOff color="gray" className="w-6 h-6" />
        )}
      </button>

      {showAlert && (
        <div 
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg transition-all duration-300 ${
            alertMessage.includes("Please log in") 
              ? "bg-yellow-500 text-white" 
              : alertMessage.includes("added") 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
          }`}
        >
          {alertMessage}
        </div>
      )}
    </>
  );
}