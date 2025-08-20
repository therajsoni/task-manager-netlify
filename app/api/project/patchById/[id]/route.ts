import { patchProjectByid } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest,
) {
    try {
        const req = await request?.json();
        const reqBody = {
            ...req,
           id: req.id
        }
        const response = await patchProjectByid(reqBody);
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