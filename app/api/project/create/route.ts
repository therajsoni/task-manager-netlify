import { createProject } from "@/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const req = await request?.json();
        const response = await createProject(req);
        if (response?.success) {
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