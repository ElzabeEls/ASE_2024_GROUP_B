"use client";
import { useState, useEffect } from "react";

const RecipeReviews = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for review submission
  const [username, setUsername] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);


  useEffect(() => {
    if (!recipeId) {
      setError("Recipe ID is missing.");
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${recipeId}`);
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        if (data.success) {
          setReviews(data.data);
        } else {
          throw new Error(data.error || "Failed to fetch reviews.");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Unable to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [recipeId]);

  // Handle review submission or editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${recipeId}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: editReviewId,
          username,
          rating,
          review: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      if (isEditing) {
        // Update the edited review in the UI
        setReviews((prev) =>
          prev.map((r) =>
            r._id === editReviewId
              ? { ...r, username, rating, review: reviewText, date: new Date() }
              : r
          )
        );
      } else {
        // Add the new review to the list
        setReviews((prev) => [
          { _id: data.reviewId, username, date: new Date(), rating, review: reviewText },
          ...prev,
        ]);
      }

      // Reset the form
      setUsername("");
      setReviewText("");
      setRating(5);
      setIsEditing(false);
      setEditReviewId(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Unable to submit review. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  
  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {/* Review Submission/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            className="w-full border rounded p-2"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Star{(i + 1) > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          {submitting ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
        </button>
      </form>

      {/* Render Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
       
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          No reviews available for this recipe. Be the first to leave one!
        </p>
      )}
    </section>
  );
};

export default RecipeReviews;
