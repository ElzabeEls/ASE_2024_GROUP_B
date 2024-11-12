"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchRecipes } from "../../lib/api"; // Adjust this import based on your project structure

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTextQuery, setTextSearchQuery] = useState("");
  const [searchCategoryQuery, setCategorySearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  let debounceTimeout = null;

  // Initialize search query from URL search parameters
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setTextSearchQuery(search);
    const category = searchParams.get("category") || "";
    setCategorySearchQuery(category);
  }, [searchParams]);

  // Handle debounce for fetching suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await fetchRecipes(1, 5, query); // Get limited suggestions
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Debounced search input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTextSearchQuery(value);

    // Clear any existing debounce
    clearTimeout(debounceTimeout);

    // Set debounce for 300ms
    debounceTimeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle selection of an auto-suggested title
  const handleSuggestionClick = (title) => {
    setTextSearchQuery(title);
    setShowSuggestions(false); // Close the suggestion pop-up
    performSearch(title); // Fetch the full recipe details
  };

  // Function to perform search and navigate to the result
  const performSearch = (query) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      newSearchParams.set("search", encodeURIComponent(query));
    } else {
      newSearchParams.delete("search");
    }
    
    let url = `/?page=1&limit=20&search=${encodeURIComponent(query)}`;
    
    if (searchCategoryQuery && searchCategoryQuery.trim() !== "") {
      url += `&category=${encodeURIComponent(searchCategoryQuery)}`;
    }

    // Redirect to the new URL with updated search parameters
    router.push(url);
  };

  return (
    <div className="relative flex justify-center mt-8">
      <form onSubmit={(e) => { e.preventDefault(); performSearch(searchTextQuery); }} className="flex">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTextQuery}
          onChange={handleInputChange}
          className="w-full max-w-lg px-4 py-2 border-2 border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 text-black"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-black hover:bg-gray-800 rounded-r-md shadow-md transition-all duration-300"
        >
          Search
        </button>
      </form>
      {/* Auto-suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full mt-1 w-full max-w-lg bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion.title)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion.title}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No recipes found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;