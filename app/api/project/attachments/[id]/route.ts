import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectToDB from "@/actions/config";
import AttachmentSchemaModel from "@/models/Attachments";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    // const uploader = "UserX"; // 🔹 replace with logged-in user name/email
    const cookie = await cookies();
    const id = cookie.get("token")?.value;
    const uploadedFiles = [];
    const projectId = (await params)?.id;
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    if (!id) {
      return Response.json({
        error: null, message: "You have invalid token", status: 403, data: null, success: false,
      })
    }
    const verifyToken = await jsonwebtoken.verify(id, process.env.secretkey!)
    if (typeof verifyToken === "string") {
      return Response.json({
        error: null, message: "You have invalid token", status: 403, data: null, success: false,
      })
    }
    type UploadedFile = {
      public_id: string;
      secure_url: string;
      format: string;
      resource_type: string;
      bytes: number;
      original_filename: string;
    };
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded: UploadedFile = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(

          { folder: `projects/${projectId}`, resource_type: "auto", },
          (err, result) => {
            if (err) return reject(err);
            if (!result) return reject(new Error("Cloudinary upload failed, no result"));
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format,
              resource_type: result.resource_type,
              bytes: result.bytes,
              original_filename: result.original_filename,
            });
          }
        );
        stream.end(buffer);
      });
      // save metadata in MongoDB
      const saved = await AttachmentSchemaModel.create({
        projectId: projectId,
        public_id: (uploaded).public_id,
        secure_url: (uploaded).secure_url,
        format: (uploaded).format,
        resource_type: (uploaded).resource_type,
        bytes: (uploaded).bytes,
        original_filename: (uploaded).original_filename,
        uploader: verifyToken?.id ?? null,
        savedFileName: fileName,
      });
      uploadedFiles.push(saved);
    }

    return NextResponse.json({ success: true, projectId: projectId, attachments: uploadedFiles });
  } catch (err) {
    console.log(err, "error");

    return NextResponse.json({ success: false, error: err, message: "Internal Server Error" }, { status: 500 });
  }
}
