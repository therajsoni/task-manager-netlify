import { selecteProjectValidUsers } from "@/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const req = await request.json();        
        const data = await selecteProjectValidUsers(req.id);
        if (!data.success) {
            return NextResponse.json({
                success: data.success,
                status: data.status,
                message: data.message,
                error: data?.error,
            })
        }
        return NextResponse.json({
            success: true,
            status: 200,
            message: "data getted Successfully",
            error: null,
            data: data?.data
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Server Error",
            error: error,
        })
    }
}