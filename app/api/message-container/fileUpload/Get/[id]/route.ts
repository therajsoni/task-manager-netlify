// app/api/message-container/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/actions/config";
import TaskUploadsModel from "@/models/TaskUploads";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Key is required" },
        { status: 400 }
      );
    }

    const project = await TaskUploadsModel.findOne({ key }).populate("messages.senderId", "username _id");
    if (!project) {
      return NextResponse.json(
        { success: false, message: "No messages found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project.messages,
    });
  } catch (err) {
    console.error("GET messages error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
