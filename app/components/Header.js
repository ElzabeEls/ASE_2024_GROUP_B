"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "../../lib/api";
import CategoryFilter from "./CategoryFilter";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Fetch categories and directly set if it's an array or data structure
        const categoriesData = await fetchCategories();

        // Check if categoriesData is an array or has categories property, adjust as needed
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (selectedCategory) => {
    if (router.isReady) {
    router.push(`/?category=${selectedCategory}`);
    console.log("Selected Category:", selectedCategory);
    // Add any logic to filter items based on the selected category if needed
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-300 bg-opacity-80 shadow-md backdrop-blur-lg">
      {/* Top Row - Navigation Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="h-10 cursor-pointer">
              <Image
                src="/ArejengLogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-full w-auto"
              />
            </div>
          </Link>
          <Link href="/">
            <h1 className="text-gray-800 text-2xl font-bold">Arejeng</h1>
          </Link>
        </div>
        <div className="space-x-6 flex items-center">
          <Link href="/">
            <span className="hover:text-gray-500 cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z"
                  fill="#080341"
                ></path>
              </svg>
            </span>
          </Link>
          <Link href="/favourites">
            <span className="hover:text-gray-500 cursor-pointer">
              Favourites
            </span>
          </Link>
          <Link href="/recipes">
            <span className="hover:text-gray-500 cursor-pointer">Recipes</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row - Filter, Sort, and Search */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between border-t border-gray-200">
        {/* Filter and Sort */}
        <div className="flex items-center space-x-4">
          {/* Filter by Category */}
          <CategoryFilter
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />

          {/* Sort by */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-gray-700">
              Sort:
            </label>
            <select
              id="sort"
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select Sort Option</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.77 18.3C9.2807 18.3 7.82485 17.8584 6.58655 17.031C5.34825 16.2036 4.38311 15.0275 3.81318 13.6516C3.24325 12.2757 3.09413 10.7616 3.38468 9.30096C3.67523 7.84029 4.39239 6.49857 5.44548 5.44548C6.49857 4.39239 7.84029 3.67523 9.30096 3.38468C10.7616 3.09413 12.2757 3.24325 13.6516 3.81318C15.0275 4.38311 16.2036 5.34825 17.031 6.58655C17.8584 7.82485 18.3 9.2807 18.3 10.77C18.3 11.7588 18.1052 12.738 17.7268 13.6516C17.3484 14.5652 16.7937 15.3953 16.0945 16.0945C15.3953 16.7937 14.5652 17.3484 13.6516 17.7268C12.738 18.1052 11.7588 18.3 10.77 18.3ZM10.77 4.74999C9.58331 4.74999 8.42327 5.10189 7.43657 5.76118C6.44988 6.42046 5.68084 7.35754 5.22672 8.45389C4.77259 9.55025 4.65377 10.7566 4.88528 11.9205C5.11679 13.0844 5.68824 14.1535 6.52735 14.9926C7.36647 15.8317 8.43556 16.4032 9.59945 16.6347C10.7633 16.8662 11.9697 16.7474 13.0661 16.2933C14.1624 15.8391 15.0995 15.0701 15.7588 14.0834C16.4181 13.0967 16.77 11.9367 16.77 10.75C16.77 9.15869 16.1379 7.63257 15.0126 6.50735C13.8874 5.38213 12.3613 4.74999 10.77 4.74999Z"
                fill="#7f6539"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
