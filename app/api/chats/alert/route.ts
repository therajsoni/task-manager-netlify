import connectToDB from "@/actions/config"
import MessageModel from "@/models/Messages";
import { isValidObjectId } from "mongoose";
export async function POST(request: Request) {
    try {
        await connectToDB();
        const req = await request.json();
        if (!req.project || !req.project.id || !req.project.name || !isValidObjectId(req.project.id)) {
            return Response.json({
                data: null, error: null, message: "All required fields not provided", status: 404, success: false,
            })
        }
        const getAlerts = await MessageModel.find({
            "project.id": req.project.id,
            "project.name": req.project.name,
            type: "alert"
        }).select("text sender createdAt").sort({
                createdAt: -1
            }).populate("sender", "username -_id")
        return Response.json({
            data: getAlerts, error: null, message: "Data getted successfully", status: 200, success: true,
        })
    } catch (error) {
        return Response.json({
            data: null, error: error, message: "Server error occured", status: 500, success: false,
        })
    }
} 