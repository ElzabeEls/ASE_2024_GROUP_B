"use client";

import { useEffect, useState } from "react";

export default function AdvancedFiltering({ selectedFilter, stepsFilter, page }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch tags from the API on component mount
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/Tags");
        const data = await response.json();

        if (data.success) {
          setTags(data.tags || []);
        } else {
          console.error("Failed to fetch tags:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

  // Handle tag selection
  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag) // Remove tag if already selected
        : [...prevSelectedTags, tag] // Add tag if not selected
    );
  };

  return (
    <form action={`/?page=${page}`} method="GET" className="mb-4">
      <label htmlFor="filter" className="block text-lg font-semibold mb-2">
        Advanced Filters:
      </label>
      <select
        id="filter"
        name="filter"
        defaultValue={selectedFilter}
        className="p-2 border rounded"
      >
        <option value="none">Select a filter</option>
        {/* Example options */}
        {/* <option value="low-calories">Low Calories</option> */}
      </select>

      {/* Filter by Number of Steps */}
      <label htmlFor="steps" className="block text-lg font-semibold mt-4 mb-2">
        Filter by Number of Steps:
      </label>
      <input
        type="number"
        id="steps"
        name="steps"
        placeholder="Enter steps"
        defaultValue={stepsFilter || ""}
        className="p-2 border rounded"
      />

      {/* Tag Selection */}
      <fieldset className="mt-4">
        <legend className="text-lg font-semibold mb-2">Filter by Tags:</legend>
        {tags.length > 0 ? (
          tags.map((tag) => (
            <label key={tag} className="block">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                onChange={() => handleTagChange(tag)}
                checked={selectedTags.includes(tag)}
                className="mr-2"
              />
              {tag}
            </label>
          ))
        ) : (
          <p>Loading tags...</p>
        )}
      </fieldset>

      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded mt-4"
      >
        Apply
      </button>
    </form>
  );
}
