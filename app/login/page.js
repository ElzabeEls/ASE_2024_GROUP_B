"use client";

import React, { useState } from "react";

/**
 * Login Component
 *
 * @component
 * @returns {JSX.Element} A login form with email and password fields, including a show/hide password toggle.
 */
export default function Login() {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  /**
   * Handles form submission and sends data to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/authorisation/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setSuccess("Login successful!");
        setEmail("");
        setPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Log In
        </h1>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Or log in with{" "}
          <button className="text-blue-600 hover:underline focus:outline-none">
            Google
          </button>
        </p>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}