import connectToDB from "@/actions/config";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    try {
        await connectToDB();
        const body = await request.json();
        const { projectId, data } = body;
        let check = await fallbackTaskModel.findOne({
            projectId: projectId
        });
        if (!check) {
            check = fallbackTaskModel.create({projectId:projectId,data});
            return NextResponse.json({
                status: 201,
                error: null,
                message: "created",
                success: true,
                data: check,
            });
        } else {
            check.data = data;
            if (!check) {
                return NextResponse.json({
                    status: 400,
                    error: null,
                    message: "Not found Project , Bad Request",
                    success: false,
                    data: null,
                });
            }
            check.save();
            return NextResponse.json({
                status: 200,
                error: null,
                message: "Updated",
                success: true,
                data: check,
            });
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            status: 500,
            error,
            message: "Server error occured",
            success: false,
            data: null,
        });
    }
}