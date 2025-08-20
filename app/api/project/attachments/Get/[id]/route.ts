// app/api/project/attachments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import connectToDB from "@/actions/config";
import ProjectModel from "@/models/projectModel";
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // project id
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file"); // pass ?file=Invoice.png
    if (!fileName) {
      return NextResponse.json({ success: false, message: "File name missing" }, { status: 400 });
    }
    // remove from DB
    const project = await ProjectModel.findByIdAndUpdate(
      id,
      { $pull: { attachments: { name: fileName } } },
      { new: true }
    );
    if (!project) {
      return NextResponse.json({ success: false, message: " not found" }, { status: 404 });
    }
    // remove from disk
    const filePath = path.join(process.cwd(), "public", "uploadsFile", fileName);
    try {
      await unlink(filePath);
    } catch (e) {
      console.warn("File not found on disk, only DB entry removed");
    }
    return NextResponse.json({
      success: true,
      message: "Attachment deleted successfully",
      project,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "not getted attachements" }, { status: 500 });
  }
}
