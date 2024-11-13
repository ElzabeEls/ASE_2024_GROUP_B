import Home from "./Home";

/**
 * Page component that renders the Home component with search parameters.
 *
 * @param {Object} context - The context object containing URL parameters.
 * @returns {JSX.Element} The Home component with passed search parameters.
 */
export default function Page({ searchParams }) {
  return <Home searchParams={searchParams} />;
}
