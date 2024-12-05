"use client";

import './global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { metadata } from '../lib/metadata';

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(prefersDarkMode);
    // Add or remove the 'dark' class immediately
    document.documentElement.classList.toggle('dark', prefersDarkMode);
    setThemeLoaded(true); // Prevent rendering until the theme is set
  }, []);

  useEffect(() => {
    if (themeLoaded) {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, themeLoaded]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (!themeLoaded) {
    // Optionally render a loading spinner or nothing to prevent mismatched rendering
    return null;
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
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
