import connectToDB from "@/actions/config";
import AllRegisterUser from "@/models/RegisterAllUser";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    try {
        await connectToDB();
        const details = await request.json();
        const {username,password} = details.details;        
        if (!username) {
            return NextResponse.json({
                error: null,
                success: false,
                status: 401,
                message: "Bad Request Username field must be request",
            });
        }
        if (!password || password.length === 0) {
            return NextResponse.json({
                error: null,
                success: false,
                status: 401,
                message: "Bad Request Password field require",
            });
        }
        const findUser = await AllRegisterUser.findOne({ username });
        if (!findUser) {
            return NextResponse.json({
                error: null,
                success: false,
                status: 404,
                message: "user not found",
            });
        }
        findUser.password = password;
        await findUser.save();
        return NextResponse.json({
            error: null,
            success: true,
            status: 200,
            message: "Password field updated",
            data: findUser
        });
    } catch (error) {
        return NextResponse.json({
            error: error,
            success: false,
            status: 500,
            message: "Server Error",
        })
    }
}