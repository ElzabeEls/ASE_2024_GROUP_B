"use client";
import { useRouter } from "next/navigation";
import { fetchCategories, fetchRecipes } from "../../lib/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * CategoryFilter component allows users to select a category from a dropdown and filters recipes based on the selected category.
 * It fetches the available categories from an API, displays them in a dropdown, and updates the URL and fetches recipes based on user selection.
 * 
 * @component
 * @returns {JSX.Element} The rendered component for filtering categories.
 */
const CategoryFilter = () => {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [noRecipesFound, setNoRecipesFound] = useState(false);

  /**
   * Effect hook to fetch categories on component mount.
   * It calls the fetchCategories function and sets the categories state.
   * 
   * @async
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Fetch categories and directly set if it's an array or data structure
        const categoriesData = await fetchCategories();
        console.log("categoriesData");
        console.log(categoriesData);
        // Check if categoriesData is an array or has categories property.
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

  /**
   * Handles the category change event. It updates the URL with the selected category and search query,
   * fetches recipes based on the selected category, and updates the state for `noRecipesFound` accordingly.
   * 
   * @async
   * @function
   * @param {Event} event - The change event triggered by selecting a category from the dropdown.
   * @returns {void}
   */
  const handleChange = async (event) => {
    const selectedCategory = event.target.value;
    let url = `/?page=1&limit=20`;

    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (selectedCategory && selectedCategory.trim() !== "") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }

    try {
      // Fetch recipes based on selected category
      const recipes = await fetchRecipes(1, 20, search || "", selectedCategory, [], "");
      setNoRecipesFound(recipes.length === 0); // Set noRecipesFound if no recipes are returned
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setNoRecipesFound(true); // Show message in case of fetch error
    }

    router.push(url);
    console.log("Selected Category:", selectedCategory);
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
        <option value=""> Default</option>
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

