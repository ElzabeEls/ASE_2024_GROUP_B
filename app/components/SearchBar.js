"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize searchQuery state from URL search parameters
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Construct the new search query
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Update the search parameter
    if (searchQuery.trim()) {
      newSearchParams.set("search", encodeURIComponent(searchQuery));
    } else {
      newSearchParams.delete("search"); // Remove if empty
    }

    // Redirect to the new URL with updated search parameters
    router.push(`?page=1&limit=20&${newSearchParams.toString()}`);

  };

  return (
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
  );
};

export default SearchBar;