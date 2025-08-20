import connectToDB from "@/actions/config";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB();
    try {
        const request = await fallbackTaskModel.find();
        return NextResponse.json({
            error: null,
            success: true,
            status: 200,
            message: "All Task Getted SuccessFully",
            data: request,
        })
    } catch (error) {
        return NextResponse.json({
            error: error,
            success: false,
            status: 500,
            message: "Server Error occured",
        })
    }
}