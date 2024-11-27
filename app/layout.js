"use client";

import './global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { metadata } from '../lib/metadata';
import { useAuth } from './hooks/useAuth';

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
  const { user, loading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(prefersDarkMode);
    document.documentElement.classList.toggle('dark', prefersDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <Header user={user} />
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
