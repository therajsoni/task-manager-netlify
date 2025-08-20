import { getProjectByName } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest,
) {
    try {
        const data = await request.json();
        const response = await getProjectByName(data.name);
        if (!response?.success) {
            return NextResponse.json({
                status: response?.status,
                success: response?.success,
                message: response?.message,
                error: response?.error
            })
        }
        return NextResponse.json({
            status: response?.status,
            message: response?.message,
            success: response?.success,
            data: response?.data,
        })
    } catch (error) {
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Server Error Occured",
            error: error
        })
    }
}