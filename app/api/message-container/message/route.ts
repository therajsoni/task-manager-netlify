import connectToDB from "@/actions/config";
import MessageContainerModel from "@/models/MessageContainer";

export async function POST(request: Request) {
    try {
        await connectToDB();
        
        const requestBody = await request.json();
        console.log("Request Key", requestBody);
        if (!requestBody?.key) {
            return Response.json({
                error: null, data: null, status: 404, success: false, message: "Key send"
            })
        }
        const fetchingMessage = await MessageContainerModel.find({
            key: requestBody?.key
        }).populate("senderId")

        console.log(fetchingMessage, "fetching data");
        

        return Response.json({
            error: null, data: fetchingMessage, status: 200, success: true, message: "fetched the messages"
        })
    } catch (error) {
        console.log(error, "error");
        return Response.json({
            error, data: null, status: 500, success: false, message: "Internal Server Error while fetching the messages"
        })
    }
}