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
    /* This resturns the favourite objects according to the database
    
    for example:
    data.favourites
[
  {
    _id: '6746d95d235eb1a553003efb',
    userEmail: 'elzabe@codespace.co.za',
    recipeId: '6b432ef8-a563-4eef-9f31-827987a3e0c9',
    created_at: '2024-11-27T08:33:33.049Z'
  },
  {
    _id: '6746d949235eb1a553003efa',
    userEmail: 'elzabe@codespace.co.za',
    recipeId: '774b0956-1286-48bf-85a2-7f5530d66deb',
    created_at: '2024-11-27T08:33:13.296Z'
  }
]
    */
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

      /*
      So here we now extract the recipeId's because we need them to fetch the actual recipes that have the images and description  etc.
      This map fucntion now crates an array with all the relevant recipe id's
      for example:
      favouriteNumbers
[
  '6b432ef8-a563-4eef-9f31-827987a3e0c9',
  '774b0956-1286-48bf-85a2-7f5530d66deb'
]
      */
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
    favouriteNumbers, // <- Here
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
