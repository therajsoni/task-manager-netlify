import connectToDB from "@/actions/config"
import TaskFeaturesModel from "@/models/TaskFeature";

export async function POST(request: Request) {
    try {

        await connectToDB();
        const jsonBody = await request.json();
        console.log(jsonBody, "jsonBody")
        if (!jsonBody.key) {
            return Response.json({
                success: false,
                message: "Key is missing"
            })
        }
        let data = await TaskFeaturesModel.findOne({
            key: jsonBody.key
        });
        if (data !== null) {
            data.features = jsonBody.features
        } else {
            data = await TaskFeaturesModel.create({
                key: jsonBody.key,
                features: jsonBody.features
            })
        }
        await data.save();
        return Response.json({
            success: true,
            message: "Data Saved successfully",
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