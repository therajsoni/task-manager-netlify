import connectToDB from "@/actions/config";
import ProjectModel from "@/models/projectModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await connectToDB();
    try {
        const req = await request.json();
        const projects = await ProjectModel.find({
            $or: [
                { by: req.userId },
                { projectManager: req.userId },
                { 'group.member': req.username }
            ]
        }).select('name');
        return NextResponse.json({
            error: null, status: 200, success: true, message: "Data getted successfully", data: projects
        })

    } catch (error) {
        return NextResponse.json({
            error, status: 500, success: false, message: "Server error occured", data: null
        })
    }
}