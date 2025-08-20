import connectToDB from "@/actions/config";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    const ObjectId = mongoose.Types.ObjectId;
    try {
        await connectToDB();
        const res = await request?.json();
        const { projectId } = res;
        const tasks = await fallbackTaskModel.findOne({ projectId: new ObjectId(projectId) });
        if (!tasks) {
            return NextResponse.json({
                error : null,
                message : "Tasks Not found",
                status : 404,
                success : false,
                data : null,
            })
        }
        return NextResponse.json({
            error: null,
            message: "Data getted",
            status: 200,
            success: true,
            data: tasks
        })
    } catch (error) {
        return NextResponse.json({
            error: error,
            message: "Server Error",
            status: 500,
            success: false,
        })
    }
}