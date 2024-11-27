import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

/**
 * Middleware to handle JWT token verification using jose.
 */
export async function middleware(req) {
  // Retrieve the token from cookies
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect("/login");
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);

    // Attach the decoded user information to the request object
    req.user = payload;
    console.log("Token verified", payload);

    // Attach user info to headers for client-side access
    const headers = new Headers(req.headers);
    headers.set("user-id", payload.userId);
    headers.set("user-email", payload.email);
    

    // Proceed with the request
    return NextResponse.next({ headers });
  } catch (error) {
    return NextResponse.redirect("/login");
  }
}

// Apply the middleware only to specific routes
export const config = {
  matcher: ["/api/test"],
};
