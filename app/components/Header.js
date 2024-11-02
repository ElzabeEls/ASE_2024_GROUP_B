"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "../../lib/api";
import CategoryFilter from "./CategoryFilter";

const Header = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories(); // Call the fetchCategories function
        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        } else {
          console.error("Error fetching categories:", categoriesData.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (selectedCategory) => {
    // Logic to handle category selection
    console.log("Selected Category:", selectedCategory);
    // You can also add logic to filter your displayed items based on the selected category here
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
                width="64px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z"
                    fill="#080341"
                  ></path>{" "}
                </g>
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
              {/* Add more sort options as needed */}
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
              width="64px"
              height="64px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M10.77 18.3C9.2807 18.3 7.82485 17.8584 6.58655 17.031C5.34825 16.2036 4.38311 15.0275 3.81318 13.6516C3.24325 12.2757 3.09413 10.7616 3.38468 9.30096C3.67523 7.84029 4.39239 6.49857 5.44548 5.44548C6.49857 4.39239 7.84029 3.67523 9.30096 3.38468C10.7616 3.09413 12.2757 3.24325 13.6516 3.81318C15.0275 4.38311 16.2036 5.34825 17.031 6.58655C17.8584 7.82485 18.3 9.2807 18.3 10.77C18.3 11.7588 18.1052 12.738 17.7268 13.6516C17.3484 14.5652 16.7937 15.3953 16.0945 16.0945C15.3953 16.7937 14.5652 17.3484 13.6516 17.7268C12.738 18.1052 11.7588 18.3 10.77 18.3ZM10.77 4.74999C9.58331 4.74999 8.42327 5.10189 7.43657 5.76118C6.44988 6.42046 5.68084 7.35754 5.22672 8.45389C4.77259 9.55025 4.65377 10.7566 4.88528 11.9205C5.11679 13.0844 5.68824 14.1535 6.52735 14.9926C7.36647 15.8317 8.43556 16.4032 9.59945 16.6347C10.7633 16.8662 11.9697 16.7474 13.0661 16.2933C14.1624 15.8391 15.0995 15.0701 15.7588 14.0834C16.4181 13.0967 16.77 11.9367 16.77 10.75C16.77 9.15869 16.1379 7.63257 15.0126 6.50735C13.8874 5.38213 12.3613 4.74999 10.77 4.74999Z"
                  fill="#7f6539"
                ></path>{" "}
                <path
                  d="M20 20.75C19.9015 20.7504 19.8038 20.7312 19.7128 20.6934C19.6218 20.6557 19.5392 20.6001 19.47 20.53L15.34 16.4C15.2075 16.2578 15.1354 16.0697 15.1388 15.8754C15.1422 15.6811 15.221 15.4958 15.3584 15.3583C15.4958 15.2209 15.6812 15.1422 15.8755 15.1388C16.0698 15.1354 16.2578 15.2075 16.4 15.34L20.53 19.47C20.6704 19.6106 20.7493 19.8012 20.7493 20C20.7493 20.1987 20.6704 20.3893 20.53 20.53C20.4608 20.6001 20.3782 20.6557 20.2872 20.6934C20.1962 20.7312 20.0985 20.7504 20 20.75Z"
                  fill="#7f6539"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
