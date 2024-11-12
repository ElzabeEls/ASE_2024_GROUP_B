// app/components/Header.js
"use client";

import React, { useEffect, useState } from "react";
//import React from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryFilter from "./CategoryFilter";

const Header = () => {
  
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-100 bg-opacity-80 shadow-md backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between space-x-4">
        
        {/* Logo */}
        <Link href="/">
          <div className="h-25 cursor-pointer w-25">
            <Image
              src="/ArejengLogo.png"
              alt="Logo"
              width={60}
              height={100}
              className="h-full w-auto rounded-xl"
            />
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <span className="hover:text-gray-500 cursor-pointer">Home</span>
          </Link>
          <Link href="/recipes">
            <span className="hover:text-gray-500 cursor-pointer">Recipes</span>
          </Link>
          <Link href="/recipes">
            <span className="hover:text-gray-500 cursor-pointer">Favourites</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;



























