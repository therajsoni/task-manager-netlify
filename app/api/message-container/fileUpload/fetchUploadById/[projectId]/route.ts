import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/actions/config";
import ProjectModel from "@/models/projectModel";
import TaskUploadsModel from "@/models/TaskUploads";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const project = await TaskUploadsModel.findOne({
        key : id
    }).select("attachments");
    if (!project) {
      return NextResponse.json(
        { success: false, message: " not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      attachments: project.attachments,
    });
  } catch (err) {
    console.error("GET attachments error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
