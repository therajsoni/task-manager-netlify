import { checkIsUserHavaToken } from "@/actions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const req =  checkIsUserHavaToken();
      if (!req) {
        return NextResponse.json({
            message : "You have invalid Token",
            status : 400,
        })
      }
      const responseStack = NextResponse.json({
              message: "User Logout Successfully",
              success: true,
              status: 200,
            });            
            responseStack.headers.set(
              "Set-Cookie", `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
            );
            return responseStack
    } catch (error) {
        return NextResponse.json({
            message : "Server Error",
            status : 500,
            error
        })
    }
}