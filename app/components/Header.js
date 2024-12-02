"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";


const Header = () => {
  return (
    <header className=" glossy-highlight fixed top-0 left-0 w-full z-50 bg-[var(--header-bg)] bg-opacity-80 shadow-md backdrop-blur-lg">
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
            <h1 className="text-[var(--header-text)] text-2xl font-bold">Arejeng</h1>
          </Link>
        </div>
        <div className="space-x-6 flex items-center">
          <Link href="/">
            <span className="hover:text-[var(--link-hover)] cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
              </svg>
            </span>
          </Link>
          <Link href="/recipe">
            <span className="hover:text-[var(--link-hover)] cursor-pointer">Recipes</span>
          </Link>
          <Link href="/favourites">
            <span className="hover:text-[var(--link-hover)] cursor-pointer">Favourites</span>
          </Link>
          <Link href="/login">
            <button className="bg-[var(--button-bg)] px-2 py-1 rounded-full">
              <span className="font-bold text-[var(--login-text)]">Login</span>
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-[var(--button-bg)] px-2 py-1 rounded-full">
              <span className="font-bold text-[var(--signup-text)]">Sign Up</span>
            </button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

