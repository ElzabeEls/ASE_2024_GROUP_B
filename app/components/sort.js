// app/components/Sort.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Sort = () => {
  const [sortOption, setSortOption] = useState(""); // Define local sort option state
  const router = useRouter();

  const sortOptions = [
    { label: "Default", value: "" },
    { label: "Title", value: "title" },
    { label: "Prep time", value: "prep" },
    { label: "Cook time", value: "cook" },
    { label: "Date", value: "published" },
  ];

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);
    router.push(`/recipes?sort=${selectedSort}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-gray-700">
        Sort:
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={handleSortChange}
        className="previewSort"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sort;
