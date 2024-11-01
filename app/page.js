import Link from "next/link";
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

  // Get selected filter option from search params
  const selectedFilter = searchParams.filter || "none";

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
      <div className="flex justify-center mt-8 items-center">
        <Link 
          href={`/?page=${page - 1}&filter=${selectedFilter}`} 
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
            page === 1 ? "bg-gray-300 pointer-events-none opacity-50" : "bg-orange-500 hover:bg-orange-600"
          }`} 
          aria-label="Previous page" 
          title="Previous page"
        >
          ←
        </Link>
        
        <span className="px-4 text-lg font-semibold text-orange-700">Page {page}</span>
        
        <Link 
          href={`/?page=${page + 1}&filter=${selectedFilter}`} 
          className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600" 
          aria-label="Next page" 
          title="Next page"
        >
          →
        </Link>
      </div>

      {/* Filter Form */}
      <form action={`/?page=${page}`} method="GET" className="mb-4">
        <label htmlFor="filter" className="block text-lg font-semibold mb-2">
          Advanced Filters:
        </label>
        <select
          id="filter"
          name="filter"
          defaultValue={selectedFilter}
          className="p-2 border rounded"
        >
          <option value="none">Select a filter</option>
          {/* EXAMPLE <option value="low-calories">Low Calories</option> */}
          {/* Add more options as needed */}
        </select>
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Apply
        </button>
      </form>
    </main>
  );
}
