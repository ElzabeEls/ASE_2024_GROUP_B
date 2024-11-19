import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken";


/**
 * Middleware to handle JWT token verification.
 * This middleware checks for a JWT token in the request cookies, verifies it, and attaches
 * the decoded user information to the request object. If the token is missing or invalid,
 * it returns a 401 Unauthorized response.
 *
 * @function middleware
 * @param {NextRequest} req - The incoming Next.js request object.
 * @returns {NextResponse | Response} - A NextResponse to proceed if the token is valid,
 * or a Response with a 401 status if the token is invalid or missing.
 */
export function middleware(req) {
  // Retrieve the token from cookies
  let token = req.cookies.get("token");

  // If the token is not found, respond with 401 Unauthorized
  if (!token) {
    console.log("No token found in cookies.");
    return new Response("Unauthorized: No token found", { status: 401 });
  }
  // Log the token to inspect its format
  console.log("Extracted token:", token);

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;
    console.log("Token verified", decoded); // Log the decoded user information

    // Proceed with the request
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, log the error and respond with 401 Unauthorized
    console.log("Token verification failed:", error.message);
    return new Response("Unauthorized: Invalid token", { status: 401 });
  }
}

// Apply the middleware only to specific routes
export const config = {
  matcher: ['/api/test'],
};
