import Link from "next/link";
import RecipeCard from "./components/RecipeCard";
import { fetchRecipes } from "../lib/api";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
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
  const selectedTags = searchParams.tags ? searchParams.tags.split(",") : [];
  const stepsFilter = searchParams.steps || "";

  // Fetch recipes with necessary parameters
  const data = await fetchRecipes(
    currentPage,
    searchParams.limit || 20,
    searchParams.search || "",
    searchParams.category,
    selectedTags
  );

  return (
    <main>
      <SearchBar />
      <CategoryFilter />
      <AdvancedFiltering
        selectedFilter={searchParams.filter || "none"}
        stepsFilter={stepsFilter}
        selectedTags={selectedTags}
        page={currentPage}
      />

      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      {/* Display applied filters */}
      {searchParams.search && searchParams.search !== "none" && (
        <div className="mb-4 text-center">
          <span className="text-md font-semibold">Applied Filter:</span>{" "}
          <span className="px-2 py-1 bg-gray-200 rounded-full text-gray-700">
            {searchParams.search}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((recipe) => (
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
          href={`/?page=${currentPage + 1}&search=${searchParams.search || ""}&filter=${searchParams.search || ""}`}
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