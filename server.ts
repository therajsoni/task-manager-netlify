import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import mongoose, { Document } from "mongoose";
import connectToDB from "./actions/config";
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

// project then task -> key -> from frontend sent keys of arrays i check that you have that key or not

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        // when connet
        socket.on("any-new-message-for-me", async (key) => {
            const messages = await MessageContainerModel.find({
                key
            });
            socket.emit("yes-new-messages-for-you", messages);
        })
        // console.log({ msg, key, senderId, attachments, senderName, projectId, taskName });
        socket.on("new-msg-i-send-to-some-one", async (data) => {
            console.log(data);
            // socket.emit("new-msg-for-you", data);
            await ensureDBConnection();
            await MessageContainerModel.create({
                key: data?.key,
                messageText: data?.msg,
                senderId: data?.senderId,
                attachments: data?.attachments,
            })
            // a notification event for user
            socket.emit("a-new-message-for-for", { projectName: data?.projectName, taskName: data?.taskName, by: data?.senderName, time: new Date() });
        });

        socket.on("new-alert", (data) => {
            io.emit("alert-new", data)
        })
    })



    httpServer.listen(
        4000
        // process.env.APP_URL
        // || "https://aonprojectmanagement.netlify.app"
        , () => {
            console.log(`socket server`);
        });
});