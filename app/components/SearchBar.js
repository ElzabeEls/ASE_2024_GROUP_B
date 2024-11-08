"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTextQuery, setTextSearchQuery] = useState("");
  const [searchCategoryQuery, setCategorySearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);


  // Initialize searchQuery state from URL search parameters
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setTextSearchQuery(search);
    const category = searchParams.get("category") || "";
    setCategorySearchQuery(category);
  }, [searchParams]);


// Debounce logic for auto-submission of short queries
useEffect(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout); // Clear the previous timer
  }

  // Only debounce for short queries (e.g., 1-2 characters)
  if (searchTextQuery.trim().length > 0 && searchTextQuery.trim().length <= 2) {
    const timeout = setTimeout(() => {
      handleSearch(); // Auto-submit the search
    }, 300); // Delay of 300ms

    setDebounceTimeout(timeout);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timeout);
  }
}, [searchTextQuery, ]);

const handleSearch = (e) => {
  if (e) e.preventDefault();

    // Construct the new search query
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update the search parameter
    if (searchTextQuery.trim()) {
      newSearchParams.set("search", encodeURIComponent(searchTextQuery));
    } else {
      newSearchParams.delete("search"); // Remove if empty
    }


    let url = `/?page=1&limit=20`;

    if (searchTextQuery && searchTextQuery.trim() !== "") {
      url += `&search=${encodeURIComponent(searchTextQuery)}`;
    }

    if (searchCategoryQuery && searchCategoryQuery.trim() !== "") {
      url += `&category=${encodeURIComponent(searchCategoryQuery)}`;
    }

    // Redirect to the new URL with updated search parameters
    router.push(url);
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center mt-8">
      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchTextQuery}
        onChange={(e) => setTextSearchQuery(e.target.value)}
        className="w-full max-w-lg px-4 py-2 border-2 border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600 text-black"
      />
      <button
        type="submit"
        className="px-6 py-2 text-white bg-black hover:bg-gray-800 rounded-r-md shadow-md transition-all duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;