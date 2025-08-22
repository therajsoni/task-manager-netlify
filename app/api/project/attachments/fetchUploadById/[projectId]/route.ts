import connectToDB from "@/actions/config";
import AttachmentSchemaModel from "@/models/Attachments";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,

  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectToDB();
    const projectId = (await params)?.projectId
    const files = await AttachmentSchemaModel.find({ projectId }).populate("uploader", "username").sort({ createdAt: 1 });
    console.log(files, "files");
    
    return NextResponse.json({ success: true, attachments: files });
  } catch (err) {
    return NextResponse.json({ success: false, error: err, message : "Internal Server Error" }, { status: 500 });
  }
}
