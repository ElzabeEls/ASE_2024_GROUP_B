import RecipeCard from "./components/RecipeCard";
import { fetchRecipes } from "../lib/api";

/**
 * The Home component fetches paginated recipes and displays them in a grid layout.
 * The `page` prop is derived from the URL query.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.recipes - Array of recipe data for the current page.
 * @param {number} props.page - Current page number.
 * @returns {JSX.Element} A React component displaying a grid of recipe cards with pagination controls.
 */
export default async function Home({ searchParams }) {
  const page = parseInt(searchParams.page, 10) || 1; // Get the page number from search params
  const limit = 20;

  // Fetch recipes based on the current page
  const data = await fetchRecipes(page, limit);
  
  return (
    <main>
      <h1 className="text-2xl font-bold text-center mb-8">Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-8">
        <a
          href={`/?page=${page - 1}`}
          className={`px-4 py-2 mr-2 bg-gray-300 rounded ${page === 1 && "pointer-events-none opacity-50"}`}
        >
          Previous
        </a>
        <span className="px-4">Page {page}</span>
        <a
          href={`/?page=${page + 1}`}
          className="px-4 py-2 ml-2 bg-gray-300 rounded"
        >
          Next
        </a>
      </div>
    </main>
  );
}
