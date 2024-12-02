"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { fetchRecipes } from "../../lib/api";

/**
 * A search bar component that allows users to search for recipes by title and category.
 * It handles query debouncing, search parameter updates, and redirects based on user input.
 *
 * @component
 * @example
 * return (
 *   <SearchBar />
 * )
 */
const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for search parameters
  const [searchTextQuery, setTextSearchQuery] = useState("");
  const [searchCategoryQuery, setCategorySearchQuery] = useState("");
  const [searchTagsQuery, setTagsSearchQuery] = useState("");
  const [searchStepsQuery, setStepsSearchQuery] = useState("");

  // Suggestions state and debouncing references
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef(null);
  const longQueryTimeout = useRef(null);

  // Initialize states from search parameters when available
  useEffect(() => {
    if (searchParams) {
      setTextSearchQuery(searchParams.get("search") || "");
      setCategorySearchQuery(searchParams.get("category") || "");
      setTagsSearchQuery(searchParams.get("tags") || "");
      setStepsSearchQuery(searchParams.get("steps") || "");
    }
  }, [searchParams]);

  // Handle debounce for fetching suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true); // Set loading to true when fetching begins
      const data = await fetchRecipes(
        1,
        5,
        query,
        searchCategoryQuery,
        searchTagsQuery,
        searchStepsQuery
      ); // Get limited suggestions
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false); // Set loading to false when fetching completes
    }
  };

  // Debounced search input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTextSearchQuery(value);

    // Clear any existing debounce
    clearTimeout(debounceTimeout.current);
    clearTimeout(longQueryTimeout.current);

    // Short query debounce (1-3 characters)
    if (!value.trim()) {
      handleSearch("");
    }

    // Short query debounce (1-3 characters)
    if (value.trim().length > 0 && value.trim().length <= 3) {
      debounceTimeout.current = setTimeout(() => {
        handleSearch(value);
      }, 500);
    }

    // Long query debounce (>3 characters)
    if (value.trim().length > 3) {
      longQueryTimeout.current = setTimeout(() => {
        fetchSuggestions(value);
        handleSearch(value);
      }, 500); // Debounce long queries with a delay of 500ms
    }

    // // New debounce for submitting any query after 500ms
    // clearTimeout(debounceTimeout.current); // Clear previous timeout
    // debounceTimeout.current = setTimeout(() => {
    //   handleSearch(value); // Ensure the query is submitted after 500ms

    // }, 500);
  };

  /**
   * Handles the search form submission, constructs a new search URL,
   * and redirects the user to the updated URL with query parameters.
   *
   * @param {Event} [e] - The form submission event. Prevents default form behavior if provided.
   */
  const handleSearch = (value) => {
    if (value !== searchTextQuery) {
      let url = `recipe/?page=1&limit=20`;

      if (value && value.trim() !== "") {
        url += `&search=${encodeURIComponent(value)}`;
      }

      if (searchCategoryQuery && searchCategoryQuery.trim() !== "") {
        url += `&category=${encodeURIComponent(searchCategoryQuery)}`;
      }

      // setIsLoading(true); // Set loading to true when search starts
      // Redirect to the new URL with updated search parameters
      router.push(url);
    }
  };

  // Handle selection of an auto-suggested title
  const handleSuggestionClick = (title) => {
    setTextSearchQuery(title);
    setShowSuggestions(false); // Close the suggestion pop-up
    performSearch(title); // Fetch the full recipe details
  };

  /**
   * Highlights matching words in the recipe titles.
   * @param {string} title - The recipe title.
   * @param {string} query - The search query.
   * @returns {JSX.Element} The title with highlighted matches.
   */

  return (
    <div className="relative flex justify-center mt-8">
      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchTextQuery}
        onChange={handleInputChange}
        className="w-full max-w-lg px-4 py-2 border-2 border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 text-black"
      />

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
