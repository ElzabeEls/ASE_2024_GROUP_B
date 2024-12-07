import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Handles the POST request for user login.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing email and password.
 * @returns {Promise<Response>} - A response object indicating the result of the authentication attempt.
 */
export async function POST(req) {
  try {
    // Extract email and password from the request body
    const { email, password } = await req.json();

    // Validate input: Ensure email and password are provided
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("devdb");

    // Check if a user with the given email exists
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Define cookie options
    const cookieOptions = {
    httpOnly: true,  // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Only use cookies over HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "Strict", // Helps prevent CSRF attacks
      path: "/", // Cookie is accessible throughout the entire app
    };

    // Set additional cookies for user state
    const userCookies = [
      `user_email=${encodeURIComponent(user.email)}; Path=/; Max-Age=3600; Secure=${process.env.NODE_ENV === "production"}; SameSite=Strict`,
      `logged_in=yes; Path=/; Max-Age=3600; Secure=${process.env.NODE_ENV === "production"}; SameSite=Strict`,
      `user_session=${token}; Path=/; Max-Age=3600; Secure=${process.env.NODE_ENV === "production"}; SameSite=Strict; HttpOnly`,
    ];

    // Set all cookies in headers
    const setCookieHeader = [`token=${token}; ${Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")}`, ...userCookies];

    // Respond with user details and cookies
    return new Response(
      JSON.stringify({
        message: "Login successful",
        userId: user._id,
        email: user.email,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": setCookieHeader.join(", "),
        },
      }
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error("Login error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
