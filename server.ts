import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import mongoose, { Document } from "mongoose";

import ProjectModel from "./models/projectModel";
import connectToDB from "./actions/config";
import MessageModel from "./models/Messages";
import AllRegisterUser from "./models/RegisterAllUser";
import MessageContainerModel from "./models/MessageContainer";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev }); // no hostname/port

const handler = app.getRequestHandler();

// Map<userId, socketId>
const OnlineUsers = new Map<string, string>();

// Type definitions
interface GroupMember {
  member: string;
}

interface ProjectDoc extends Document {
  _id: string;
  group?: GroupMember[];
  name: string;
}

interface IUser extends Document {
  _id: string;
  username: string;
}

interface AlertData {
  title: string;
  description: string;
  project: { id: string; name?: string };
  createdBy: { id: string; username: string };
  key?: string
}

interface CustomMessageData extends AlertData {
  receiver?: { id: string };
}

async function ensureDBConnection() {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectToDB();
      console.log("✅ MongoDB connected");
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    // console.log(`✅ Socket connected: ${socket.id}`);

    // Register user
    socket.on("register-user", (userId: string) => {

      if (userId) {
        OnlineUsers.set(userId, socket.id);
        console.log(`🟢 User Registe & ${userId} is online with socket ${socket.id}`);
      }
    });

    // handle Message Container
    socket.on("message-container-in-send-message", async ({ key, message, senderId, usernameSender }) => {
 
      // can be error occured here
      const sendTo = await ProjectModel.findOne({
        name: key.split("#$#")[0]
      });

      const membersName = sendTo?.group?.map((m: GroupMember) => m.member) || [];

      const membersById = await Promise.all(
        membersName.map(async (username: string) => {
          const user = await AllRegisterUser.findOne({ username }).select("_id").lean<IUser>();
          return user?._id.toString();
        })
      );

      console.log(membersById, "membersById");

      // Emit to all online members except sender
      membersById.forEach((memberId) => {
        if (memberId && OnlineUsers.has(memberId)) {
          if (memberId === senderId) {
            return
          }
          socket.to(OnlineUsers.get(memberId)!).emit("message-container-from-new-message", {
            by: usernameSender, key: {
              project: key.split("#$#")[0],
              test: key.split("#$#")[1]
            },
          });
        }
      });

      console.log(
        key,
        message,
        senderId,
        "this is sender details"
      );



      const MessageConatainerData = await MessageContainerModel.create({
        key,
        messageText: message,
        senderId
      });

      const messageDoc = await MessageConatainerData?.populate("senderId", "username");
    
      // emit new message
      socket.emit("message-container-from-new-message", {
        by: messageDoc?.username,
        key: key,
      });
    })
    // Handle alerts
    socket.on("alert", async (data: AlertData) => {
      await ensureDBConnection();

      const projectResponse = await ProjectModel.findById(data.project.id).lean<ProjectDoc>();
      const membersName = projectResponse?.group?.map((m: GroupMember) => m.member) || [];

      const membersById = await Promise.all(
        membersName.map(async (username: string) => {
          const user = await AllRegisterUser.findOne({ username }).select("_id").lean<IUser>();
          return user?._id.toString();
        })
      );

      console.log(membersById, "membersById");

      // Emit to all online members except sender
      membersById.forEach((memberId) => {
        if (memberId && OnlineUsers.has(memberId)) {
          socket.to(OnlineUsers.get(memberId)!).emit("alert-for-you", {
            title: data.title,
            description: data.description,
            createdBy: data.createdBy.username,
            time: new Date(),
          });
        }
      });

      // Save in DB
      await MessageModel.create({
        text: { title: data.title, description: data.description },
        type: "alert",
        sender: data.createdBy.id,
        members: membersById,
        project: data.project,
      });
    });

    // Group messages
    socket.on("group-message", async (data: AlertData) => {
      await ensureDBConnection();

      const projectResponse = await ProjectModel.findById(data.project.id).lean<ProjectDoc>();
      const membersName = projectResponse?.group?.map((m: GroupMember) => m.member) || [];

      const membersById = await Promise.all(
        membersName.map(async (username: string) => {
          const user = await AllRegisterUser.findOne({ username }).select("_id").lean<IUser>();
          return user?._id.toString();
        })
      );

      membersById.forEach((memberId) => {
        if (memberId && OnlineUsers.has(memberId)) {
          socket.to(OnlineUsers.get(memberId)!).emit("group-message-for-you", {
            title: data.title,
            description: data.description,
            createdBy: data.createdBy.username,
            time: new Date(),
          });
        }
      });

      await MessageModel.create({
        text: { title: data.title, description: data.description },
        type: "group",
        sender: data.createdBy.id,
        members: membersById,
        project: data.project,
        key: data?.key || null
      });
    });

    // Custom messages
    socket.on("custom-message", async (data: CustomMessageData) => {
      if (data.receiver?.id && OnlineUsers.has(data.receiver.id)) {
        socket.to(OnlineUsers.get(data.receiver.id)!).emit("custom-message-for-you", {
          title: data.title,
          description: data.description,
          createdBy: data.createdBy.username,
          time: new Date(),
        });
      }

      await MessageModel.create({
        text: { title: data.title, description: data.description },
        type: "custom",
        sender: data.createdBy.id,
        receiver: data.receiver?.id,
        project: { id: data.project.id, name: data.project.name },
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of OnlineUsers.entries()) {
        if (socketId === socket.id) {
          OnlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  httpServer.listen(
    process.env.APP_URL 
    || "https://aonprojectmanagement.netlify.app"
    , () => {
    console.log(`socket server`);
  });
});
