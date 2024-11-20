import './global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Head from 'next/head';
import { useEffect, useState } from 'react';

/**
 * Metadata for the Arejeng Recipe App.
 * @typedef {Object} Metadata
 * @property {string} title - The title of the application.
 * @property {string} description - Description of the app for SEO and social sharing.
 * @property {Object} icons - Icon details for favicon and apple touch icons.
 * @property {Array<Object>} icons.icon - Array of icons for the app.
 * @property {string} icons.icon[].rel - Type of icon (e.g., "icon", "shortcut icon").
 * @property {string} icons.icon[].url - Path to the icon image.
 * @property {string} icons.icon[].sizes - Icon dimensions (e.g., "48x48").
 * @property {string} icons.apple - Path to the apple touch icon.
 * @property {string} manifest - Path to the web manifest file.
 * @property {string} applicationName - Name of the application.
 * @property {Object} openGraph - Open Graph meta properties.
 * @property {string} openGraph.title - Open Graph title.
 * @property {string} openGraph.description - Open Graph description.
 * @property {string} openGraph.type - Type of content (e.g., website).
 * @property {Array<Object>} openGraph.images - Images used in Open Graph.
 * @property {string} openGraph.images[].url - Image URL.
 * @property {number} openGraph.images[].width - Image width in pixels.
 * @property {number} openGraph.images[].height - Image height in pixels.
 * @property {string} openGraph.images[].alt - Alt text for the image.
 * @property {Array<string>} keywords - SEO keywords for the application.
 * @property {string} author - Author of the application.
 * @property {string} robots - SEO robots directive.
 */
export const metadata = {
  title: "Arejeng Recipes",
  description: "Arejeng Recipe App is your ultimate culinary companion, offering an extensive collection of easy-to-follow recipes that cater to every taste and occasion.",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon-48x48.png", sizes: "48x48" },
      { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  applicationName: "Arejeng Recipe App",
  openGraph: {
    title: "Arejeng Recipe App",
    description: "Discover a variety of recipes with Arejeng Recipe App",
    type: "website",
    images: [
      {
        url: "/ArejengLogo.png",
        width: 800,
        height: 600,
        alt: "Arejeng Recipe App",
      },
    ],
  },
  keywords: ["recipes", "cooking", "food", "ArejengRecipeApp"],
  author: "Group_B",
  robots: "index, follow",
};

/**
 * Viewport settings for the app.
 * @typedef {Object} Viewport
 * @property {string} themeColor - Theme color for the viewport.
 */
export const viewport = {
  themeColor: "#ffffff",
};

/**
 * Root layout component of the application.
 * Provides the main structure with the header, main content area, and footer.
 *
 * @function RootLayout
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements to be rendered in the main section.
 * @returns {JSX.Element} The HTML layout for the page.
 */
export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Initialize and apply the theme mode on initial load.
   * Checks `localStorage` for a saved theme or uses system preferences.
   * @function
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(prefersDarkMode);
    document.documentElement.classList.toggle('dark', prefersDarkMode);
  }, []);

  /**
   * Toggle between light and dark theme modes.
   * Updates the `localStorage` and applies the new theme to the document.
   * @function
   */
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <link rel="manifest" href={metadata.manifest} />
        <meta name="theme-color" content={isDarkMode ? "#0a0a0a" : "#ffffff"} />
      </Head>
      <body className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Header />
        <div className="flex justify-center p-4">
          <button
            onClick={toggleTheme}
            className="theme-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded"
          >
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
