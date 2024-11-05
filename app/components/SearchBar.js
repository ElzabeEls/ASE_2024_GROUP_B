"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize searchQuery state from URL search parameters
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Construct the new search query
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      newSearchParams.set("search", encodeURIComponent(searchQuery));
    } else {
      newSearchParams.delete("search");
    }

    // Redirect to the new URL with updated search parameters
    router.push(`/recipes?${newSearchParams.toString()}`);

    // Fetch search results
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/search?searchTerm=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex justify-center mt-8">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border-2 border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 text-black"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-black hover:bg-gray-800 rounded-r-md shadow-md transition-all duration-300"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Search Results:</h2>
          <ul>
            {results.map((recipe) => (
              <li key={recipe._id} className="border-b py-2">
                <h3 className="text-md font-semibold">{recipe.title}</h3>
                <p>{recipe.description}</p>{" "}
                {/* Adjust based on your recipe structure */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
