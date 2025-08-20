import connectToDB from "@/actions/config";
import ProjectModel from "@/models/projectModel";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    await connectToDB();
    try {
        const projectId = await request.json();
        
        const req = await ProjectModel.findById(projectId.id);
        if (!req) {
           return NextResponse.json({
            status : 400,
            success : false,
            error : null,
            message : "Status Not found",
        }); 
        }
        req.status = projectId.status;
        await req.save();
        return NextResponse.json({
            status : 200,
            success : true,
            error : null,
            message : "Updated project Data",
        })
    } catch (error) {
        return NextResponse.json({
            status : 500,
            success : false,
            error : error,
            message : "Server Error Occured",
        });
    }
}