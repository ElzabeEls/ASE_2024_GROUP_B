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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${recipeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          rating,
          review: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      // Fetch updated reviews after submission
      setReviews((prev) => [
        { username, date: new Date(), rating, review: reviewText },
        ...prev,
      ]);
      setUsername("");
      setReviewText("");
      setRating(5);
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

      {/* Review Submission Form */}
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
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Render Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
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

const ReviewCard = ({ review }) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">{review.username}</p>
        <p className="text-xs text-gray-500">
          {new Date(review.date).toLocaleDateString()}
        </p>
      </div>
      <p className="font-medium text-teal-600">Rating: {review.rating} / 5</p>
    </div>
    <p className="text-gray-700 mt-2">{review.review}</p>
  </div>
);

export default RecipeReviews;
