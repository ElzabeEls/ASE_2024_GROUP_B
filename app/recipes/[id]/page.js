import { fetchProductById } from "../../../lib/api";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import RecipeReviews from "../../components/RecipeReviews";
import ReadInstructionsButton from "../../components/ReadInstructionsButton";
import { Home } from "lucide-react";

/**
 * The RecipeDetail component fetches and displays a specific recipe based on its ID.
 * It shows the recipe's details, including prep time, cooking time, total time, servings, tags, and images.
 *
 * @async
 * @function RecipeDetail
 * @param {Object} props - The props object.
 * @param {Object} props.params - The route parameters, containing the recipe ID.
 * @returns {JSX.Element} A React component that displays recipe details.
 *
 * @example
 * // Usage of RecipeDetail component
 * <RecipeDetail params={{ id: 'recipeId' }} />
 */
export default async function RecipeDetail({ params }) {
  const { id } = params;
  let recipe;

  try {
    const data = await fetchProductById(id);
    recipe = data;
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return (
      <div className="p-4 text-center">
        <p className="text-[var(--text-primary)]">Error: {error.message}</p>
        <a
          href="/"
          className="mt-4 inline-block text-[var(--text-primary)] bg-[var(--text-primary)]rounded-full px-6 py-2 hover:bg-[var(--text-primary)] transition duration-200"
        >
          Back to Recipes
        </a>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-4 text-center">
        <p className="text-[var(--recipe-not-found-text)]">Recipe not found</p>
        <a
          href="/"
          className="mt-4 inline-block text-[var(--back-to-recipe-text)] bg-[var(--b2r-bg)]rounded-full px-6 py-2 hover:bg-[var(--b2r-hover-bg)] transition duration-200"
        >
          Back to Recipes
        </a>
      </div>
    );
  }

  const {
    prep,
    cook,
    servings,
    title,
    description,
    tags,
    images,
    ingredients,
    instructions,
    nutrition,
  } = recipe;

  const totalTime = (prep || 0) + (cook || 0);

  const formatTime = (timeInMinutes) => `${timeInMinutes} mins`;

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <a
          href="/recipe"
          className="flex items-center justify-center w-10 h-10 bg-[var(--b2r-bg)] hover:bg-[var(--b2r-hover-bg)] rounded-full transition duration-200"
          title="Back to Recipes"
        >
          <Home className="w-5 h-5 text-[var(--recipe-not-found-text)]" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-[var(--title-color)] mb-4">{title}</h1>
      <p className="text-lg font-bold text-[var(--title-color)] mb-6">{description}</p>

      {tags && tags.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[var(--b2r-bg)] font-bold text-[var(--title-color)] px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-8">
          <Image
            src={images[0]}
            alt={title}
            width={800}
            height={400}
            className="w-70 h-[300px] object-cover rounded-lg shadow-md mb-4"
            priority
          />
          {images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.slice(1).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${title} ${index + 2}`}
                  width={200}
                  height={200}
                  className="w-50 h-40 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-6 mb-8">
        {prep !== undefined && (
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 font-bold text-[var(--title-color)]" />
            <div>
              <p className="text-sm font-bold text-[var(--title-color)]">Prep Time</p>
              <p className="font-medium">{formatTime(prep)}</p>
            </div>
          </div>
        )}
        {cook !== undefined && (
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6  font-bold text-[var(--title-color)]" />
            <div>
              <p className="text-sm font-bold text-[var(--title-color)]">Cook Time</p>
              <p className="font-medium">{formatTime(cook)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 font-bold text-[var(--title-color)]" />
          <div>
            <p className="text-sm font-bold text-[var(--title-color)]">Total Time</p>
            <p className="font-medium">{formatTime(totalTime)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6  font-bold text-[var(--title-color)]" />
          <div>
            <p className="text-sm font-bold text-[var(--title-color)]">Servings</p>
            <p className="font-medium">{servings}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8  ">
        {/* Ingredients */}
        <Card>
          <CardContent className="pt-6 border border-[var(--border)] bg-[var(--card-bg)]">
            <h2 className="text-2xl font-bold mb-4 text-[var(--title-color)]">Ingredients</h2>
            <ul className="space-y-2">
              {ingredients && Object.keys(ingredients).length > 0 ? (
                Object.entries(ingredients).map(
                  ([ingredient, quantity], index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full font-bold bg-[var(--title-color)] mt-1 flex-shrink-0" />
                      <span className=" font-bold text-[var(--title-color)]">
                        {quantity} {ingredient}
                      </span>
                    </li>
                  )
                )
              ) : (
                <li className="text-[var(--text-primary)]">No ingredients available.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card
          className="shadow-lg rounded-lg border border-[var(--border)] bg-[var(--card-bg)]"
          id="instructions-section"
        >
          <div className="flex justify-end px-6 pt-4">
            <ReadInstructionsButton instructions={instructions} />
          </div>
          <CardContent className="pt-6 px-6">
            <h2 className="text-2xl font-bold mb-3 text-[var(--title-color)] text-m">
              Instructions
            </h2>

            <ol className="space-y-4">
              {instructions.length > 0 ? (
                instructions.map((step, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="w-8 h-8 flex items-center justify-center bg-[var(--numbers)] text-[var(--text-primary)] rounded-full font-semibold shadow-sm text-m">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[var(--title-color)] font-bold leading-snug text-sm">
                        {step}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-[var(--title-color)] font-bold text-center text-sm">
                  No instructions available.
                </li>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Nutritional Information */}
      {nutrition && (
        <Card className="mt-8 border-[var(--border)] bg-[var(--card-bg)]">
          <CardContent className="pt-6 ">
            <h2 className="text-2xl font-bold mb-4 text-[var(--title-color)] ">
              Nutritional Information
            </h2>
            <ul className="space-y-2 font-bold" >
              {Object.entries(nutrition).map(([key, value]) => {
                const units = {
                  energy: "kJ",
                  calories: "kcal",
                  protein: "g",
                  fat: "g",
                  saturated: "g",

                  carbohydrates: "g",
                  sugar: "g",
                  fiber: "g",
                  sodium: "mg",
                  cholesterol: "mg",
                };

                const unit = units[key.toLowerCase()] || "";

                return (
                  <li key={key} className="flex justify-between text-[var(--title-color)] font-bold">
                    <span className="capitalize">{key}</span>
                    <span className="font-bold">
                      {value} {unit}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {id ? (
        <RecipeReviews recipeId={id} />
      ) : (
        <p className="text-[var(--title-color)]">Loading recipe ID...</p>
      )}
    </main>
  );
}
