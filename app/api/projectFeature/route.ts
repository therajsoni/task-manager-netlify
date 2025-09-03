import connectToDB from "@/actions/config";
import TaskFeaturesModel from "@/models/TaskFeature";

export async function POST(request: Request) {
    try {
        await connectToDB();
        const jsonBody = await request.json();
        console.log(jsonBody, "jsonBody");

        if (!jsonBody.key) {
            return Response.json({
                success: false,
                message: "Key is missing"
            })
        }
        const data = await TaskFeaturesModel.findOne({
            key: jsonBody.key
        });
        if (!data) {
            return Response.json({
                success: false,
                message: "Key base data not found",
                status: 403
            })
        }
        // const finalData = data?.features?.filter((f: {
        //     key: string, value: boolean, data: string
        // }) => {
        //     return f.value === true
        // })
        return Response.json({
            success: true,
            message: "Data getted of project features",
            data
        })
    } catch (error) {
        return Response.json({
            error: error,
            message: "Server Error occured",
            success: false,
        })
    }
}