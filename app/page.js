import Link from "next/link";
import RecipeCard from "./components/RecipeCard";
import { fetchRecipes } from "../lib/api";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import StepsFilter from "./components/StepsFilter";

/**
 * The Home component fetches paginated recipes and displays them in a grid layout.
 * The `page` prop is derived from the URL query.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.recipes - Array of recipe data for the current page.
 * @param {number} props.page - Current page number.
 * @returns {JSX.Element} A React component displaying a grid of recipe cards with pagination controls.
 */
export default async function Home({ params, searchParams }) {
  console.log("params", params);
  console.log("searchParams", searchParams);

  // Get current page or set default to 1
  const currentPage = parseInt(searchParams.page) || 1;

  // Construct the search parameters object dynamically
  const searchParamsToInclude = {
    page: currentPage,
    limit: searchParams.limit || 20,
    search: searchParams.search || "",
    category: searchParams.category || "",
    sortBy: searchParams.sortBy || "",
    sortOrder: searchParams.sortOrder || ""
    steps: searchParams.steps || "", // Include steps parameter

  };

  // Fetch recipes with only the necessary parameters
  const data = await fetchRecipes(
    searchParamsToInclude.page,
    searchParamsToInclude.limit,
    searchParamsToInclude.search,
    searchParamsToInclude.category,
    searchParamsToInclude.sortBy,
    searchParamsToInclude.sortOrder
    searchParamsToInclude.steps
  );

  // Ensure data is always an array to prevent errors
  const recipes = Array.isArray(data) ? data : [];

  // Check if no recipes are returned and set a message accordingly
  const noRecipesFound =
    recipes.length === 0 && searchParams.steps && searchParams.steps !== "";

  return (
    <main>
      <div className="flex space-x-20 items-center mb-8">
        {/* Search Bar */}
        <SearchBar />
        {/* Category Filter */}
        <div className="mt-8">
          <CategoryFilter />
        </div>
        {/* Steps Filter */}
        <div className="mt-8">
          <StepsFilter />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      {/* Display applied filters */}
      <div className="text-center mb-4">
        {searchParams.search && searchParams.search !== "none" && (
          <span className="text-md font-semibold">
            Search:{" "}
            <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">
              {searchParams.search}
            </span>
          </span>
        )}
        {searchParams.steps && (
          <span className="text-md font-semibold ml-4">
            Steps:{" "}
            <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">
              {searchParams.steps}
            </span>
          </span>
        )}
      </div>

      {/* Handle case when no recipes are found */}
      {noRecipesFound && (
        <p className="text-center text-lg text-red-500 mb-8">
          No recipes found with the specified number of steps.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-8 items-center">
        <Link
          href={`/?page=${currentPage - 1}&search=${searchParams.search || ""}&filter=${searchParams.search || ""}&category=${searchParams.category || ""}&steps=${
            searchParams.steps || ""
          }`&sortBy=${searchParams.sortBy || "title"}&sortOrder=${searchParams.sortOrder || "desc"}`}

          className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
            currentPage === 1
              ? "bg-gray-300 pointer-events-none opacity-50"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </Link>

        <span className="px-4 text-lg font-semibold text-orange-700">
          Page {currentPage}
        </span>

        <Link

          href={`/?page=${currentPage + 1}&search=${
            searchParams.search || ""
          }&category=${searchParams.category || ""}&steps=${
            searchParams.steps || ""
          }&sortBy=${searchParams.sortBy || "title"}&sortOrder=${searchParams.sortOrder || "desc"}`}

          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600"
          aria-label="Next page"
          title="Next page"
        >
          →
        </Link>
      </div>

      {/* Advanced Filter Form (optional) */}
      <form action={`/?page=${currentPage}`} method="GET" className="mb-4">
        <label htmlFor="filter" className="block text-lg font-semibold mb-2">
          Advanced Filters:
        </label>
        <select
          id="filter"
          name="filter"
          defaultValue={searchParams.search}
          className="p-2 border rounded"
        >
          <option value="none">Select a filter</option>
          {/* EXAMPLE <option value="low-calories">Low Calories</option> */}
        </select>

        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply
        </button>
      </form>
    </main>
  );
}
