import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectToDB from "@/actions/config";
import AttachmentSchemaModel from "@/models/Attachments";


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const public_id = searchParams.get("public_id");

    if (!public_id) {
      return NextResponse.json({ success: false, error: "File name required" }, { status: 400 });
    }

    const projectId = (await params)?.id

    const file = await AttachmentSchemaModel.findOne({
      projectId,
      public_id,
    });

    if (!file) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }

    // delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // delete from DB
    await AttachmentSchemaModel.deleteOne({ _id: file._id });

    const remaining = await AttachmentSchemaModel.find({ projectId });

    return NextResponse.json({ success: true, project: { _id: projectId, attachments: remaining } });
  } catch (err) {
    return NextResponse.json({ success: false, error: err, message : "Internal Server Error" }, { status: 500 });
  }
}
