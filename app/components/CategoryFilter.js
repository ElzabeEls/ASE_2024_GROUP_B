"use client"
import { useRouter } from "next/navigation";
import { fetchCategories } from "../../lib/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const CategoryFilter = () => {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Fetch categories and directly set if it's an array or data structure
        const categoriesData = await fetchCategories();
        console.log("categoriesData");
        console.log(categoriesData);
        // Check if categoriesData is an array or has categories property, adjust as needed
        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.categories
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);
  const router = useRouter();
  console.log("searchParams");
  console.log(searchParams);

  const search = searchParams.get("search");

  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    let url = `/?page=1&limit=20`;

    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (selectedCategory && selectedCategory.trim() !== "") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }

    router.push(url);
    console.log("Selected Category:", selectedCategory);
    // Add any logic to filter items based on the selected category if needed
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="category" className="text-gray-700 font-bold">
        Categories:
      </label>
      <select
        id="categories"
        className="px-4 py-2 border-2 border-gray-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600"
        onChange={handleChange}
      >
        <option value="">Select Category</option>
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>
    </div>
  );
};

export default CategoryFilter;
