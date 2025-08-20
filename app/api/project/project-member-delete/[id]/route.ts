import connectToDB from "@/actions/config";
import { sendEmail } from "@/actions/email";
import ProjectModel from "@/models/projectModel";
import AllRegisterUser from "@/models/RegisterAllUser";
import { NextResponse } from "next/server";
export async function POST(request: Request
) {
    await connectToDB();
    try {
        const req = await request.json();
        const emailSend = await AllRegisterUser.findOne({
            username: req?.name
        });
        const projectFind = await ProjectModel.findById(req.id).select("name");
        
        const result = await ProjectModel.updateOne(
            { _id: req.id },
            {
                $pull: {
                    group: { member: req?.name }
                }
            }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                status: 404,
                error: null,
                message: "Not Found Project",
            });
        } else if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                status: 404,
                error: null,
                message: "Member Not  Found Project",
            });
        }
        await sendEmail({ to: emailSend?.email, subject: `You Are Project Remove from Members of ${projectFind?.name}`, text: 'You are remove from project ', html: '' })
        return NextResponse.json({
            success: true,
            status: 200,
            error: null,
            message: "User remove successfully",
            data: result
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            status: 500,
            error,
            message: "Server Error Occured",
        })
    }
}