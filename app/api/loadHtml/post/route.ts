import connectToDB from "@/actions/config"
import LoadHtmlModel from "@/models/LoadHtmlModel";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        await connectToDB();
        const requestBody = await request.json();
        const cookie = await cookies();
        const data = cookie.get("token")?.value;
        if (!data) {
            return Response.json({
                error: null, message: "You have invalid token", status: 403, data: null, success: false,
            })
        }
        const verifyToken = await jsonwebtoken.verify(data, process.env.secretkey!)
        if (typeof verifyToken === "string") {
            return Response.json({
                error: null, message: "You have invalid token", status: 403, data: null, success: false,
            })
        }
        if (!(requestBody?.key && requestBody?.html)) {
            return Response.json({
                error: null, message: 'Missing fields', status: 400, data: null, success: false,
            })
        }
        const existsLoadHtmlMode = await LoadHtmlModel.findOne({
            key: requestBody?.key
        });
        if (existsLoadHtmlMode) {
            existsLoadHtmlMode.html = await requestBody?.html;
            existsLoadHtmlMode.updatedBy = verifyToken?.username;
            existsLoadHtmlMode.updatedAt = new Date();
            await existsLoadHtmlMode.save();
        } else {
            await LoadHtmlModel.create({
                key: requestBody?.key,
                html: requestBody?.html,
                uploader: verifyToken?.id,
                updatedBy: verifyToken?.username,
            });
        }
        return Response.json({
            error: null, message: 'html upload', status: 200, data: null, success: true,
        })
    } catch (error) {
        return Response.json({
            error, message: 'Internal Server Error Occured', status: 500, data: null, success: false,
        })
    }
}