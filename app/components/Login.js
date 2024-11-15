"use client";

/**
 * @file MockLogin.jsx
 * @description A mock login component for testing the login functionality.
 */

import React, { useState } from "react";

/**
 * MockLogin Component
 *
 * @component
 * @returns {JSX.Element} A mock login form with email and password fields.
 */
export default function MockLogin() {
  const [email, setEmail] = useState(""); // State for the email input
  const [password, setPassword] = useState(""); // State for the password input
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  /**
   * Handles form submission and sends data to the backend.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
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

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || "Login successful!");
        setEmail("");
        setPassword("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Mock Login
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:ring-blue-300 focus:outline-none focus:ring-2"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
