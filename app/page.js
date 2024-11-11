import Link from "next/link";
import RecipeCard from "./components/RecipeCard";
import { fetchRecipes } from "../lib/api";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import StepsFilter from "./components/StepsFilter";
import AdvancedFiltering from "./components/AdvancedFiltering";

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
  const currentPage = parseInt(searchParams.page) || 1;

  // Construct the search parameters object dynamically
  const searchParamsToInclude = {
    page: currentPage,
    limit: searchParams.limit || 20,
    search: searchParams.search || "",
    category: searchParams.category || "",
    selectedTags: searchParams.tags ? searchParams.tags.split(",") : []
  };

  // Fetch recipes with necessary parameters
  const data = await fetchRecipes(
    searchParamsToInclude.page,
    searchParamsToInclude.limit,
    searchParamsToInclude.search,
    searchParamsToInclude.category,
    searchParamsToInclude.selectedTags
  );

  const stepsFilter = searchParams.steps || "";

  return (
    <main>
<div className="flex space-x-20 items-center mb-8">
        {/* Search Bar */}
        <SearchBar />
      {/* Add margin-top to the flex container to separate it from the SearchBar */}
      <div className="flex items-center space-x-4 mb-6 mt-2">
        <CategoryFilter />
        <AdvancedFiltering
          selectedFilter={searchParams.filter || "none"}
          selectedTags={selectedTags}
          page={currentPage}
        />
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
          href={`/?page=${currentPage - 1}&search=${searchParams.search || ""}&filter=${searchParams.search || ""}`}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${currentPage === 1 ? "bg-gray-300 pointer-events-none opacity-50" : "bg-orange-500 hover:bg-orange-600"}`}
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </Link>

        <span className="px-4 text-lg font-semibold text-orange-700">Page {currentPage}</span>

        <Link
          href={`/?page=${currentPage + 1}&search=${
            searchParams.search || ""
          }&category=${searchParams.category || ""}&steps=${
            searchParams.steps || ""
          }`}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600"
          aria-label="Next page"
          title="Next page"
        >
          →
        </Link>
      </div>
    </main>
  );
}