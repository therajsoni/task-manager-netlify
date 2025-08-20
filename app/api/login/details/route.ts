import connectToDB from "@/actions/config";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import AllRegisterUser from "@/models/RegisterAllUser";
export async function GET() {
    await connectToDB();
    try {
        const cookie = cookies();
        const token = (await cookie).get("token")?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                status: 404,
                message: "Token not found",
                error: null,
                data: null
            })
        }
        const details = await jwt.verify(token, process.env.secretKey || "nextapp");
        if (typeof details === "string" || !("username" in details)) {
            return NextResponse.json({
                success: false,
                message: "Invalid token",
            });
        }
        if (!details) {
            return NextResponse.json({
                success: false,
                status: 404,
                message: "Deatils not found",
                error: null,
                data: null
            })
        }
        const data = await AllRegisterUser.findOne({ username: details?.username })
        return NextResponse.json({
            success: true,
            status: 200,
            message: "User Deatils",
            error: null,
            data: data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Server error",
            error: error,
        })
    }
}