import connectToDB from "@/actions/config";
// import LoginModel from "@/models/loginModel";
import AllRegisterUser from "@/models/RegisterAllUser";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        await connectToDB();
        const body = await request.json();
        const data = body?.data;
        if (!data?._id) {
            return NextResponse.json({
                error: null,
                message: "User ID is required for update",
                status: 400,
                success: false,
                data: null,
            });
        }
        const { email, phone, password, role } = data;
        const updatedUser = await AllRegisterUser.findByIdAndUpdate(
            data._id,
            {
                email,
                phone,
                password,
                role,
            },
            { new: true }
        );
        if (!updatedUser) {
            return NextResponse.json({
                error: null,
                message: "User not found",
                status: 404,
                success: false,
                data: null,
            });
        }
        // const newUserData = await LoginModel.updateOne(
        //     {
        //         username: data?.username
        //     },
        //     {
        //         identifier: role,
        //         password: password
        //     },
        //     {
        //         new: true
        //     });
        return NextResponse.json({
            error: null,
            message: "User updated successfully",
            status: 200,
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        return NextResponse.json({
            error,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: null,
        });
    }
}
