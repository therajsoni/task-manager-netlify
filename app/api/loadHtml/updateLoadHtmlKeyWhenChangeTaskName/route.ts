import connectToDB from "@/actions/config";
import LoadHtmlModel from "@/models/LoadHtmlModel";

export async function POST(request: Request) {
    try {
        await connectToDB();
        const requestBody = await request.json();
        if (requestBody?.Name && requestBody?.key) {
            const allLoadHtml = await LoadHtmlModel.find({
                key: requestBody?.key
            }).select("key");
            await Promise.all(allLoadHtml?.map(async (loadHtml) => {
                loadHtml.key = requestBody?.key?.split("#$#")[0] + requestBody?.Name
                await loadHtml.save();
            }))
        }
        return Response.json({
            error: null, data: null,
            status: 200, success: true,
            message: "Updated LoadHtmls",
        })
    } catch (error) {
        return Response.json({
            error, data: null,
            status: 500, success: false,
            message: "Interval Server Error",
        })
    }
}