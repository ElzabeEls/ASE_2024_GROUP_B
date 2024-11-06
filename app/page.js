import Link from "next/link";
import RecipeCard from "./components/RecipeCard";
import { fetchRecipes } from "../lib/api";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";

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

  // Construct the search parameters object dynamically
  const searchParamsToInclude = {};

  if (searchParams.page) {
    searchParamsToInclude.page = searchParams.page;
  }
  if (searchParams.limit) {
    searchParamsToInclude.limit = searchParams.limit;
  }
  if (searchParams.search) {
    searchParamsToInclude.search = searchParams.search;
  }
  if (searchParams.category) {
    searchParamsToInclude.category = searchParams.category;
  }

  // Fetch recipes with only the necessary parameters
  const data = await fetchRecipes(
    searchParamsToInclude.page,
    searchParamsToInclude.limit,
    searchParamsToInclude.search,
    searchParamsToInclude.category
  );

  const stepsFilter = searchParams.steps || "";

  return (
    <main>
      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      {/* Display applied filters */}
      {searchParams.search !== "none" && (
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
          href={`/?page=${searchParams.page - 1}&search=${
            searchParams.search
          }&filter=${searchParams.search}`}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
            searchParams.page === 1
              ? "bg-gray-300 pointer-events-none opacity-50"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </Link>

        <span className="px-4 text-lg font-semibold text-orange-700">
          Page {searchParams.page}
        </span>

        <Link
          href={`/?page=${searchParams.page + 1}&search=${
            searchParams.search
          }&filter=${searchParams.search}`}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600"
          aria-label="Next page"
          title="Next page"
        >
          →
        </Link>
      </div>

      {/* Filter Form */}
      <form
        action={`/?page=${searchParams.page}`}
        method="GET"
        className="mb-4"
      >
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

        {/* Filter by Number of Steps */}
        <label
          htmlFor="steps"
          className="block text-lg font-semibold mt-4 mb-2"
        >
          Filter by Number of Steps:
        </label>
        <input
          type="number"
          id="steps"
          name="steps"
          placeholder="Enter steps"
          defaultValue={stepsFilter || ""}

          className="p-2 border rounded text-black"

        />

        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply
        </button>
      </form>

      {/* Search Bar */}
      <SearchBar />
      <CategoryFilter />
    </main>
  );
}
