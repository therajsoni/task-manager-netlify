import connectToDB from "@/actions/config";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";
import ProjectModel from "@/models/projectModel";

export async function POST(request:Request){
  await connectToDB();
  try {
    const json = await request.json();
    const projectFind = await ProjectModel.findById(json.id);
    if (!projectFind) {
       return Response.json({
        error : null, status : 404, message : "Project not found", success : false, data : null,
    }) 
    }
    await ProjectModel.findByIdAndDelete(json.id);
    await fallbackTaskModel.find({
        projectId : json.id
    });
    return Response.json({
        error : null, status : 200, message : "Project and his related taks deleted successfully", success : true, data : null
    })
  } catch (error) {
    return Response.json({
        error : error, status : 500, message : "Internal server error", success : false, data : null,
    })
  }
}

