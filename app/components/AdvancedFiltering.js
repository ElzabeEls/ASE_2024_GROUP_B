"use client"; 

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTags } from "../../lib/api";

export default function AdvancedFiltering({ selectedFilter, stepsFilter, selectedTags = [], page }) {
  const [tags, setTags] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
  const [localStepsFilter, setLocalStepsFilter] = useState(stepsFilter || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  useEffect(() => {
    async function loadTags() {
      try {
        const tagsData = await fetchTags();
        if (tagsData && !tagsData.error) {
          setTags(tagsData);
        } else {
          console.error("Failed to fetch tags:", tagsData.error);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    loadTags();
  }, []);

  const handleTagChange = (tag) => {
    setLocalSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handleApplyFilters = () => {
    const tagsParam = localSelectedTags.join(",");
    const filterParam = selectedFilter ? `&filter=${selectedFilter}` : '';
    const stepsParam = localStepsFilter ? `&steps=${localStepsFilter}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

    router.push(
      `/?page=${page}${filterParam}${stepsParam}${searchParam}&tags=${tagsParam}`
    );
  };

  return (
    <form className="mb-4">
      <label htmlFor="filter" className="block text-lg font-semibold mb-2">
        Advanced Filters:
      </label>

      {/* Filter by Number of Steps */}
      <label htmlFor="steps" className="block text-lg font-semibold mt-4 mb-2">
        Filter by Number of Steps:
      </label>
      <input
        type="number"
        id="steps"
        name="steps"
        placeholder="Enter steps"
        value={localStepsFilter}
        className="p-2 border rounded"
        onChange={(e) => setLocalStepsFilter(e.target.value)}
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
