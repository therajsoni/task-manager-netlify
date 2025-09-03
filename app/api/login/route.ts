import { loginUser } from "@/actions";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request?.json();
    let { username } = body;
    const { password } = body
    if (!username || password) {
      return NextResponse.json({
        message: "Username and password are required",
        status: 400,
      });
    }

    username = username.trim().toLowerCase();
    const response = await loginUser({ username, password });
    if (!response.success) {
      return NextResponse.json({
        message: response.message,
        status: response.status,
      });
    }
    console.log(response, "Response");

    if (response !== undefined && response.success) {
      const token = response?.token;
      const responseStack = NextResponse.json({
        message: "User Login Successfully",
        success: true,
        status: 201,
        token,
      });
      responseStack.headers.set(
        "Set-Cookie",
        `token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 5}; HttpOnly; Secure; SameSite=Lax`
      );
      return responseStack;
    }
  } catch (error) {
    console.log(error, "error")
    return NextResponse.json({ message: "Internal Server Error", status: 500, error });
  }
}
