"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Sort component provides an interface for users to sort recipes by different criteria.
 * Matches the styling of the AdvancedFiltering component.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedSortBy - Currently selected sort criteria
 * @param {string} props.selectedSortOrder - Currently selected sort order (asc/desc)
 * @returns {JSX.Element} The rendered component for sorting
 */
export default function Sort({ selectedSortBy = "", selectedSortOrder = "" }) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [localSortBy, setLocalSortBy] = useState(selectedSortBy);
  const [localSortOrder, setLocalSortOrder] = useState(selectedSortOrder);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { label: "Preptime", value: "PREPTIME" },
    { label: "Cooktime", value: "COOKTIME" },
    { label: "Steps", value: "STEPS" },
    { label: "Date", value: "DATE" }
  ];

  const handleApplySort = () => {
    // Get existing search parameters
    const currentPage = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const steps = searchParams.get("steps") || "";
    const tags = searchParams.get("tags") || "";

    // Construct URL with all existing parameters plus sort
    let url = `/?page=${currentPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (steps) url += `&steps=${encodeURIComponent(steps)}`;
    if (tags) url += `&tags=${encodeURIComponent(tags)}`;
    if (localSortBy) url += `&sortBy=${encodeURIComponent(localSortBy)}`;
    if (localSortOrder) url += `&sortOrder=${encodeURIComponent(localSortOrder)}`;

    router.push(url);
    setIsSortOpen(false);
  };

  const handleClearSort = () => {
    setLocalSortBy("");
    setLocalSortOrder("");
    
    // Maintain other search parameters when clearing sort
    const currentPage = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const steps = searchParams.get("steps") || "";
    const tags = searchParams.get("tags") || "";

    let url = `/?page=${currentPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (steps) url += `&steps=${encodeURIComponent(steps)}`;
    if (tags) url += `&tags=${encodeURIComponent(tags)}`;

    router.push(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
      >
        <span>Sort Options</span>
        <span className="ml-2">{isSortOpen ? "▲" : "▼"}</span>
      </button>

      {/* Sliding Panel */}
      <div
        className={`absolute right-0 top-18 min-w-[280px] mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-4 z-10 transition-all duration-300 ease-in-out ${
          isSortOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 hidden"
        }`}
        style={{ display: isSortOpen ? "block" : "none" }}
      >
        <div className="space-y-4">
          <fieldset>
            <legend className="text-lg text-gray-700 font-medium mb-2">Sort By:</legend>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.value} className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={localSortBy === option.value}
                    onChange={(e) => setLocalSortBy(e.target.value)}
                    className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-lg text-gray-700 font-medium mb-2">Order:</legend>
            <div className="space-y-2">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={localSortOrder === "asc"}
                  onChange={(e) => setLocalSortOrder(e.target.value)}
                  className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                />
                <span className="text-gray-700">Ascending</span>
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={localSortOrder === "desc"}
                  onChange={(e) => setLocalSortOrder(e.target.value)}
                  className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                />
                <span className="text-gray-700">Descending</span>
              </label>
            </div>
          </fieldset>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleClearSort}
            className="text-center text-white bg-red-700 rounded-full px-4 py-2 text-sm font-medium hover:bg-red-600 focus:outline-none transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            Clear Sort
          </button>
          <button
            onClick={handleApplySort}
            className="text-center text-white bg-brown rounded-full px-4 py-2 hover:bg-green-800 transition duration-200"
          >
            Apply Sort
          </button>
        </div>
      </div>
    </div>
  );
}

