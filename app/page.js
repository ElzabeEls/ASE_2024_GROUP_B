import Link from "next/link";
import RecipeCard from "./components/RecipeCard";
import FilterIndicator from "./components/FilterIndicator";
import AdvancedFiltering from "./components/AdvancedFiltering";
import { fetchRecipes } from "../lib/api";

/**
 * The Home component fetches paginated recipes and displays them in a grid layout.
 * It fetches data from the server side by querying the backend via API.
 */
export default async function Home({ searchParams }) {
  const page = parseInt(searchParams.page, 10) || 1;
  const limit = 20;

  // Get selected filters from the search params
  const selectedFilter = searchParams.filter || "none";
  const stepsFilter = parseInt(searchParams.steps, 10) || null;
  const selectedTags = searchParams.tags ? searchParams.tags.split(",") : [];

  // Fetch recipes based on filters and pagination
  const data = await fetchRecipes(page, limit, {
    filter: selectedFilter,
    steps: stepsFilter,
    tags: selectedTags,
  });

  return (
    <main>
      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>

      {/* Display the selected filters */}
      <FilterIndicator
        selectedFilter={selectedFilter}
        stepsFilter={stepsFilter}
        selectedTags={selectedTags}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-8 items-center">
        <Link
          href={`/?page=${page - 1}&filter=${selectedFilter}&steps=${stepsFilter || ""}&tags=${selectedTags.join(",")}`}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
            page === 1
              ? "bg-gray-300 pointer-events-none opacity-50"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          ←
        </Link>

        <span className="px-4 text-lg font-semibold text-orange-700">Page {page}</span>

        <Link
          href={`/?page=${page + 1}&filter=${selectedFilter}&steps=${stepsFilter || ""}&tags=${selectedTags.join(",")}`}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600"
          aria-label="Next page"
          title="Next page"
        >
          →
        </Link>
      </div>

      {/* Filter Form */}
      <AdvancedFiltering
        selectedFilter={selectedFilter}
        stepsFilter={stepsFilter}
        selectedTags={selectedTags}
        page={page}
      />
    </main>
  );
}
