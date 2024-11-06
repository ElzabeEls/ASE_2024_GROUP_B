"use client";

import { useEffect, useState } from "react";

export default function AdvancedFiltering({ selectedFilter, stepsFilter, selectedTags, page }) {
  const [tags, setTags] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/Tags"); // Fetch all tags
        const data = await response.json();

        if (data.success) {
          setTags(data.tags); // Set the tags to the state
        } else {
          console.error("Failed to fetch tags:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []); // Empty dependency ensures this effect only runs once

  // Handle tag selection (check/uncheck)
  const handleTagChange = (tag) => {
    const updatedTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter((t) => t !== tag)
      : [...localSelectedTags, tag];

    setLocalSelectedTags(updatedTags);
  };

  // Handle form submit (apply filters)
  const handleApplyFilters = () => {
    // Redirect to the same page with updated filters in the URL
    window.location.search = `?page=${page}&filter=${selectedFilter}&steps=${stepsFilter || ""}&tags=${localSelectedTags.join(",")}`;
  };

  return (
    <form className="mb-4">
      <label htmlFor="filter" className="block text-lg font-semibold mb-2">
        Advanced Filters:
      </label>
      <select
        id="filter"
        name="filter"
        defaultValue={selectedFilter}
        className="p-2 border rounded"
        onChange={(e) => window.location.search = `?page=${page}&filter=${e.target.value}&steps=${stepsFilter || ""}&tags=${localSelectedTags.join(",")}`}
      >
        <option value="none">Select a filter</option>
        {/* Add other filter options if necessary */}
      </select>

      {/* Filter by Number of Steps (optional) */}
      <label htmlFor="steps" className="block text-lg font-semibold mt-4 mb-2">
        Filter by Number of Steps (Optional):
      </label>
      <input
        type="number"
        id="steps"
        name="steps"
        placeholder="Enter steps"
        defaultValue={stepsFilter || ""}
        className="p-2 border rounded"
        onChange={(e) => window.location.search = `?page=${page}&filter=${selectedFilter}&steps=${e.target.value || ""}&tags=${localSelectedTags.join(",")}`}
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
                checked={localSelectedTags.includes(tag)}
                className="mr-2"
              />
              {tag}
            </label>
          ))
        ) : (
          <p>Loading tags...</p>
        )}
      </fieldset>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApplyFilters}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Apply Filters
      </button>
    </form>
  );
}
