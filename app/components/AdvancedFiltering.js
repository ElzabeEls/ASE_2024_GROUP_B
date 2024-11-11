"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTags } from "../../lib/api";

export default function AdvancedFiltering({
  selectedFilter,
  selectedTags = [],
  page,
}) {
  const [tags, setTags] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

    router.push(
      `/?page=${page}${filterParam}${searchParam}&tags=${tagsParam}`
    );
  };

  return (
    <div className="relative">
      {/* Advanced Filters Dropdown Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span>Advanced Filters</span>
        <span className="ml-2">{isFilterOpen ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Menu */}
      {isFilterOpen && (
        <div className="absolute right-0 w-72 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-4 z-10 max-h-[500px] overflow-y-auto flex flex-col">
          {/* Tag Selection */}
          <fieldset>
            <legend className="text-sm text-gray-600">Tags:</legend>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <label key={tag} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag}
                      onChange={() => handleTagChange(tag)}
                      checked={localSelectedTags.includes(tag)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-300 mr-2"
                    />
                    <span className="text-gray-700">{tag}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">Loading tags...</p>
              )}
            </div>
          </fieldset>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="mt-4 block text-center text-white bg-brown rounded-full px-4 py-2 hover:bg-green-800 transition duration-200"
          >
            Apply
          </button>

        </div>
      )}
    </div>
  );
}
