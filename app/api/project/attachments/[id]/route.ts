import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import connectToDB from "@/actions/config";
import ProjectModel from "@/models/projectModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type SavedFile = {
  name: string;
  url: string;
  uploader: string;
  date: Date;
};
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    // fetch user
    const cookie = cookies();
    const token = (await cookie).get("token")?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Token not found",
        error: null,
        data: null
      })
    }
    const details = await jwt.verify(token, process.env.secretKey || "nextapp");
    if (typeof details === "string" || !("username" in details)) {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
      });
    } if (!details) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Deatils not found",
        error: null,
        data: null
      })
    }

    const { id } = await context.params;
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files uploaded" }, { status: 400 });
    }
    // ✅ Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploadsFile");
    await mkdir(uploadDir, { recursive: true });
    const savedFiles: SavedFile[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      savedFiles.push({
        name: file.name,
        url: `/uploadsFile/${file.name}`, // public URL
        uploader: details?.username, // TODO: Replace with logged-in user
        date: new Date(),
      });
    }
    const project = await ProjectModel.findByIdAndUpdate(
      id,
      { $push: { attachments: { $each: savedFiles } } },
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      project,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Error occured server error" }, { status: 500 });
  }
}
