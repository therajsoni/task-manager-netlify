// import LoginModel from "@/models/loginModel";
import AllRegisterUser from "@/models/RegisterAllUser";
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await AllRegisterUser?.findByIdAndDelete(body?._id);
        if (!user) {
            return Response.json({
                error: null,
                message: "User not found",
                status: 404,
                success: false,
                data: null,
            })
        }
        // await LoginModel.deleteOne({
        //     username : user?.username 
        // })
        return Response.json({
            error: null,
            message: "User deleted successfully",
            status: 200,
            success: true,
            data: null,
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