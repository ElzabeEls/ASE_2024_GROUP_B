"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Sort = () => {
  const [sortOption, setSortOption] = useState(""); // Define local sort option state
  const router = useRouter();

  const sortOptions = [
    { label: "Default ", value: "default" },
    { label: "Preptime: Ascending", value: "prep-asc" },
    { label: "Preptime: Descending", value: "prep-desc" },
    { label: "Cooktime: Ascending", value: "cook-asc" },
    { label: "Cooktime: Descending", value: "cook-desc" },
    { label: "Steps: Ascending", value: "steps-asc" },
    { label: "Steps: Descending", value: "steps-desc" },
    { label: "Date: Ascending", value: "date-asc" },
    { label: "Date: Descending", value: "date-desc" }
  ];

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);

    // Extract 'sortBy' and 'sortOrder' from selected sort option
    const [field, order] = selectedSort.split("-");

    // Update the URL with both 'sortBy' and 'sortOrder' query parameters
    router.push(`?sortBy=${field}&sortOrder=${order}`);
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

// // app/components/Sort.js
// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// const Sort = () => {
//   const [sortOption, setSortOption] = useState(""); // Define local sort option state
//   const router = useRouter();

//   const sortOptions = [
//     { label: "Preptime: Ascending", value: "prep-asc" },
//     { label: "Preptime: Descending", value: "prep-desc" },
//     { label: "Cooktime: Ascending", value: "cook-asc" },
//     { label: "Cooktime: Descending", value: "cook-desc" },
//     { label: "Steps: Ascending", value: "steps-asc" },
//     { label: "Steps: Descending", value: "steps-desc" },
//     { label: "Date: Ascending", value: "date-asc" },
//     { label: "Date: Descending", value: "date-desc" }
//   ];

//   const handleSortChange = (e) => {
//     const selectedSort = e.target.value;
//     setSortOption(selectedSort);
//     router.push(`/recipes?sort=${selectedSort}`);
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       <label htmlFor="sort" className="text-gray-700">
//         Sort:
//       </label>
//       <select
//         id="sort"
//         value={sortOption}
//         onChange={handleSortChange}
//         className="previewSort"
//       >
//         {sortOptions.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default Sort;
