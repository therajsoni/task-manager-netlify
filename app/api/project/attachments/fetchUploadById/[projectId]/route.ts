import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/actions/config";
import ProjectModel from "@/models/projectModel";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectToDB();
    const { projectId } = await context.params;

    const project = await ProjectModel.findById(projectId).select("attachments");
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
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
