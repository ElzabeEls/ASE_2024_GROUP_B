"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdvancedFiltering({ selectedFilter, stepsFilter, selectedTags, page }) {
  const [tags, setTags] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags || []);
  const router = useRouter();

  // Fetch tags when the component mounts
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/Tags");
        const data = await response.json();

        if (data.success) {
          setTags(data.tags);
        } else {
          console.error("Failed to fetch tags:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

  // Handle tag selection (check/uncheck multiple tags)
  const handleTagChange = (tag) => {
    const updatedTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter((t) => t !== tag)
      : [...localSelectedTags, tag];

    setLocalSelectedTags(updatedTags);
  };

  // Handle form submit (apply filters)
  const handleApplyFilters = () => {
    const tagsParam = localSelectedTags.join(","); // Join selected tags into a comma-separated string
    const filterParam = selectedFilter ? `&filter=${selectedFilter}` : '';
    const stepsParam = stepsFilter ? `&steps=${stepsFilter}` : '';

    router.push(
      `/?page=${page}${filterParam}${stepsParam}&tags=${tagsParam}`
    );
  };

  return (
    <form className="mb-4">
      <label htmlFor="filter" className="block text-lg font-semibold mb-2">
        Advanced Filters:
      </label>

      {/* Filter by Number of Steps (optional) */}
      <label htmlFor="steps" className="block text-lg font-semibold mt-4 mb-2">
        Filter by Number of Steps:
      </label>
      <input
        type="number"
        id="steps"
        name="steps"
        placeholder="Enter steps"
        value={stepsFilter || ""}
        className="p-2 border rounded"
        onChange={(e) => router.push(`/?page=${page}&filter=${selectedFilter}&steps=${e.target.value || ""}&tags=${localSelectedTags.join(",")}`)}
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
