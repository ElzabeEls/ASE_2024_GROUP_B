// components/Header.js
// components/Header.js

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";

const Header = () => {
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
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z" fill="#080341"></path>
              </svg>
            </span>
          </Link>
          <Link href="/favourites">
            <span className="hover:text-gray-500 cursor-pointer">Favourites</span>
          </Link>
          <Link href="/recipes">
            <span className="hover:text-gray-500 cursor-pointer">Recipes</span>
          </Link>
        </div>

        {/* Filter and Sort */}
        <div className="flex items-center space-x-2">
          <select
            id="category"
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Select Category</option>
            <option value="appliances">Appliances</option>
            <option value="electronics">Electronics</option>
            <option value="beauty">Beauty</option>
            <option value="books">Books</option>
          </select>
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
    </header>
  );
};

export default Header;

