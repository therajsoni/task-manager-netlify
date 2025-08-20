import connectToDB from "@/actions/config";
import AllRegisterUser from "../../../../models/RegisterAllUser";

export async function POST(request: Request) {
    try {
        await connectToDB();
        const body = await request.json();
        const requiredFields = [
            "name", "username", "phone", "email", "role", "password"
        ]
        const checkJSON = requiredFields?.every((field) => field in body?.data);
        if (!checkJSON) {
            return Response.json({
                error: null,
                message: "All fields neccessary",
                status: 404,
                success: false,
                data: null,
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        for (const key in body?.data) {
            if (!Object.prototype.hasOwnProperty.call(body.data, key)) continue;
            const value = body.data[key as keyof typeof body.data];
            if (key === "password") continue;
            if (!value || String(value).trim().length === 0) {
                return Response.json({
                    error: null,
                    message: "All fields are necessary",
                    status: 404,
                    success: false,
                    data: null,
                });
            }
            if (key === "email" && !emailRegex.test(String(value))) {
                return Response.json({
                    error: null,
                    message: "Email not valid",
                    status: 404,
                    success: false,
                    data: null,
                });
            }
            if (
                key === "phone" &&
                (!/^\d{10}$/.test(String(value)) || String(value).charAt(0) === "0")
            ) {
                return Response.json({
                    error: null,
                    message: "Phone number not valid",
                    status: 404,
                    success: false,
                    data: null,
                });
            }
        }
        const {
            name, username, email, password, role, phone
        } = body?.data;
        const checkUser = await AllRegisterUser.findOne({
            $or: [{
                name,
            },
            {
                username
            }]
        });
        if (checkUser) {
            return Response.json({
                error: null,
                message: "Duplicate Name or Username by this Already Exists please choose another ones",
                status: 404,
                success: false,
                data: null,
            })
        }
        const user = await AllRegisterUser.create({
            name,
            username,
            phone,
            email,
            password,
            role,
        });
        return Response.json({
            error: null,
            message: `Registered ${name}`,
            status: 201,
            success: true,
            data: {
                password: "",
                ...user
            },
        });
    } catch (error) {
        return Response.json({
            error: error,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: null,
        })
    }
}
export async function GET() {
    try {
        await connectToDB();
        const data = await AllRegisterUser.find({});
        return Response.json({
            error: null,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: data,
        })
    } catch (error) {
        return Response.json({
            error: error,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: null,
        })
    }
}
