import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import connectToDB from "@/actions/config";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import TaskUploadsModel from "@/models/TaskUploads";

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

    // ✅ fetch user from cookie
    const cookie = cookies();
    const token = (await cookie).get("token")?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Token not found",
        error: null,
        data: null,
      });
    }

    const details:JwtPayload | string = await jwt.verify(
      token,
      process.env.secretKey || "nextapp"
    );
    if (typeof details === "string" || !("username" in details)) {
      return NextResponse.json({
        success: false,
        message: "Invalid token",
      });
    }

    const { id } = await context.params;
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    // ✅ Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploadsFileTask");
    await mkdir(uploadDir, { recursive: true });

    const savedFiles: SavedFile[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);

      savedFiles.push({
        name: file.name,
        url: `/uploadsFileTask/${file.name}`, // public URL
        uploader: (details as JwtPayload)?.username,
        date: new Date(),
      });
    }

    // ✅ UPSERT LOGIC
    const project = await TaskUploadsModel.findOneAndUpdate(
      { key: id },
      { $push: { attachments: { $each: savedFiles } } }, // push multiple
      { upsert: true, new: true } // if not exists → create, else update
    );

    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      project,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
