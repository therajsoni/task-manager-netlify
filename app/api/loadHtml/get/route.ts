import connectToDB from "@/actions/config"
import LoadHtmlModel from "@/models/LoadHtmlModel";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        await connectToDB();
        const requestBody = await request.json();        
        const find = await LoadHtmlModel.findOne({
            key: requestBody?.key, 
        }).populate("uploader", "username");
        
        return Response.json({
            error: null, message: 'html upload', status: 200, data: find, success: true,
        })
    } catch (error) {
        return Response.json({
            error, message: 'Internal Server Error Occured', status: 500, data: null, success: false,
        })
    }
}