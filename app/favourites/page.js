import Favourites from "../components/Favourites";
import { cookies } from "next/headers";
import { fetchFavourites } from "../../lib/api";
/**
 * Page component that renders the Home component with search parameters.
 *
 * @param {Object} context - The context object containing URL parameters.
 * @returns {JSX.Element} The Home component with passed search parameters.
 */
export default async function Page({ searchParams }) {
  const currentPage = parseInt(searchParams.page) || 1;
  const token = cookies().get("token")?.value;
  let favouriteNumbers = [];

  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/favourites`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const favouriteObjects = data.favourites;

      
      favouriteNumbers = favouriteObjects.map(
        (favouriteObject) => favouriteObject.recipeId
      );

      console.log("favouriteNumbers");
      console.log(favouriteNumbers);
    }
  } catch (error) {
    console.error("Error fetching favourites:", error);
  }

  // Construct search parameters object
  const searchParamsToInclude = {
    page: currentPage,
    limit: searchParams.limit || 20,
    search: searchParams.search || "",
    category: searchParams.category || "",
    selectedTags: searchParams.tags ? searchParams.tags.split(",") : [],
    selectedSteps: searchParams.steps || "",
  };

  /* Fetch ONLY the recipes with the given recipeIds which are passed as the favouritesNumbers array we just created based on search parameters */
  const data = await fetchFavourites(
    favouriteNumbers, 
    searchParamsToInclude.page,
    searchParamsToInclude.limit,
    searchParamsToInclude.search,
    searchParamsToInclude.category,
    searchParamsToInclude.selectedTags,
    searchParamsToInclude.selectedSteps
  );

  const recipes = Array.isArray(data) ? data : [];

  return <Favourites recipes={recipes} />;
}
