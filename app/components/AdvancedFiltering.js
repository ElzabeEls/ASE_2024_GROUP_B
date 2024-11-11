"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTags } from "../../lib/api";
import CategoryFilter from "./CategoryFilter";
import StepsFilter from "./StepsFilter";

export default function AdvancedFiltering({
  selectedSteps = "",
  selectedTags = [],
  page,
}) {
  const [tags, setTags] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [localSelectedSteps, setLocalSelectedSteps] = useState(selectedSteps);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);
  const [showStepsFilter, setShowStepsFilter] = useState(true);
  const [showTagsFilter, setShowTagsFilter] = useState(true);
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

  const handleClearTags = () => {
    setLocalSelectedTags([]); // Clear the selected tags
    const tagsParam = ""; // Remove tags from the query
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
    const stepsParam = localSelectedSteps ? `&steps=${localSelectedSteps}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

    router.push(`/?page=${page}${searchParam}${categoryParam}${stepsParam}`); // Update URL with cleared tags
  };

  const handleApplyFilters = () => {
    const tagsParam = localSelectedTags.join(",");
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : '';
    const stepsParam = localSelectedSteps ? `&steps=${localSelectedSteps}` : '';
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

    router.push(`/?page=${page}${searchParam}&tags=${tagsParam}${categoryParam}${stepsParam}`);
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
        <div className="absolute right-0 min-w-[280px] max-w-xs md:max-w-sm lg:max-w-md mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-4 z-10 max-h-[500px] flex flex-col origin-top-right">
          
          {/* Toggle Buttons for Filters */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setShowCategoryFilter((prev) => !prev)}
              className="text-sm font-medium text-blue-600"
            >
              {showCategoryFilter ? "Hide" : "Show"} Category Filter
            </button>
            <button
              onClick={() => setShowStepsFilter((prev) => !prev)}
              className="text-sm font-medium text-blue-600"
            >
              {showStepsFilter ? "Hide" : "Show"} Steps Filter
            </button>
            <button
              onClick={() => setShowTagsFilter((prev) => !prev)} // Show/Hide Tags Filter
              className="text-sm font-medium text-blue-600"
            >
              {showTagsFilter ? "Hide" : "Show"} Tags Filter
            </button>
          </div>

          {/* Conditionally Render Category Filter */}
          {showCategoryFilter && (
            <div className="space-y-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          )}

          {/* Conditionally Render Tags Filter */}
          {showTagsFilter && (
            <div className="space-y-4 max-h-[200px] overflow-y-auto">
              <fieldset>
                <legend className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span>Tags:</span>
                  {/* Conditionally render the "Clear All Tags" button */}
                  {localSelectedTags.length > 0 && (
                    <button
                      onClick={handleClearTags}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </legend>
                <div className="space-y-2">
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
            </div>
          )}

          {/* Conditionally Render Steps Filter */}
          {showStepsFilter && (
            <div className="space-y-4 max-h-[200px] overflow-y-auto">
              <StepsFilter selectedSteps={localSelectedSteps} setSelectedSteps={setLocalSelectedSteps} />
            </div>
          )}

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
