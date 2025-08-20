import { createGroupTeamOfProject } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest
) {
    try {
        const data = await request.json();
        const result = await createGroupTeamOfProject(data.team, data.id);
        if (!result?.success) {
            return NextResponse.json({
                success: result?.success,
                status: result?.status,
                message: result?.message,
                error: result?.error,
            })
        }
        return NextResponse.json({
            success: true,
            status: 200,
            message: "Project Team is Created",
            error: null,
            data: result?.data
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