import connectToDB from "@/actions/config";
import AllRegisterUser from "@/models/RegisterAllUser";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        const allUser = await AllRegisterUser.find({}).select("username email _id role");
        return NextResponse.json({
            success: true,
            status: 200,
            error: null,
            message: 'all login users',
            data: allUser
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            status: 500,
            error: error,
            message: "Server Error",
        })
    }
}