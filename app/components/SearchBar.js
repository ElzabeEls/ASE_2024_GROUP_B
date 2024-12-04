"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { fetchRecipes } from "../../lib/api";

/**
 * A search bar component that allows users to search for recipes by title, category, tags, and steps.
 * * It includes debounced input handling, displays suggestions, and updates the URL query parameters.
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

  // State for managing search inputs and suggestions
  const [searchTextQuery, setTextSearchQuery] = useState(""); // The current search text input
  const [searchCategoryQuery, setCategorySearchQuery] = useState(""); // The selected category for filtering
  const [searchTagsQuery, setTagsSearchQuery] = useState(""); // The selected tags for filtering
  const [searchStepsQuery, setStepsSearchQuery] = useState(""); // The selected steps for filtering

  const [suggestions, setSuggestions] = useState([]); // Suggestions for the current query
  const [showSuggestions, setShowSuggestions] = useState(false); // Flag to control suggestion dropdown visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching suggestions.

  const debounceTimeout = useRef(null); // Timeout reference for short query debounce
  const longQueryTimeout = useRef(null); // Timeout reference for long query debounce


   /**
   * Syncs the search state with URL query parameters when the component mounts or query parameters change.
   */
  useEffect(() => {
    if (searchParams) {
      setTextSearchQuery(searchParams.get("search") || "");
      setCategorySearchQuery(searchParams.get("category") || "");
      setTagsSearchQuery(searchParams.get("tags") || "");
      setStepsSearchQuery(searchParams.get("steps") || "");
    }
  }, [searchParams]);



   /**
   * Fetches recipe suggestions based on the search query.
   * Updates the suggestions state and handles loading status.
   *
   * @param {string} query - The current search query.
   */
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


/**
   * Handles changes in the search input field and debounces the query submission.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
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
      }, 300);  // Debounce short queries with a delay of 300ms
    }

    // Long query debounce (> 3 characters)
    if (value.trim().length > 3) {
      longQueryTimeout.current = setTimeout(() => {
        fetchSuggestions(value);
        handleSearch(value);
      }, 500); // Debounce long queries with a delay of 500ms
    }

    // Debounce for submitting any query when waiting
    clearTimeout(debounceTimeout.current); // Clear previous timeout
    debounceTimeout.current = setTimeout(() => {
      handleSearch(value); 
    }, 500);// Ensure the query is submitted after 500ms
  };


  /**
   * Handles the search form submission, constructs a new search URL,
   * and redirects the user to the updated URL with query parameters.
   *
   * @param {string} value - The search query to process.
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

    performSearch(title); // Fetch the full recipe details with the selected suggestion
  };

  /**
   * Performs the search when a suggestion is clicked or search is manually submitted.
   * @param {string} query - The search query.
   */
  const performSearch = (query) => {
    // Construct the search URL with the query parameter
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("search", encodeURIComponent(query));

    let url = `recipe/?page=1&limit=20`;

    if (query && query.trim() !== "") {
      url += `&search=${encodeURIComponent(query)}`;
    }

    if (searchCategoryQuery && searchCategoryQuery.trim() !== "") {
      url += `&category=${encodeURIComponent(searchCategoryQuery)}`;
    }

    setIsLoading(true); // Set loading to true when search starts
    // Redirect to the new URL with updated search parameters
    router.push(url);
  };

  return (
    <div className="relative flex justify-center mt-8">
      <form onSubmit={handleSearch} className="flex justify-center mt-8">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTextQuery}
          onChange={handleInputChange}
          className="w-full max-w-lg px-4 py-2 border-2 rounded-l-md focus:outline-none focus:ring-2 text-[var(--input-text)] bg-[var(--input-bg)] border-[var(--input-border)] focus:ring-[var(--button-hover-bg)]"
        />

        {/* Button */}
        <button
          type="submit"
          className={`px-6 py-2 rounded-r-md shadow-md transition-all duration-300 flex items-center justify-center text-white ${
            isLoading
              ? "bg-[var(--button-bg)] cursor-not-allowed"
              : "[var(--button1-bg)] hover:bg-[var(--button-hover-bg)]"
          }`}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Auto-suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full mt-1 w-full max-w-lg bg-[var(--dropdown-bg)] border-[var(--dropdown-border)] rounded-md shadow-lg z-10">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion.title)}
                className="px-4 py-2 cursor-pointer hover:bg-[var(--dropdown-hover-bg)] text-[var(--dropdown-text)]"
              >
                <p className="text-sm text-black">{suggestion.title}</p>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-[var(--dropdown-muted-text)]">
              No suggestions
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
