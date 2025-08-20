// models/TaskUploads.ts
import mongoose from "mongoose";
const TaskUploadsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String
});
const TaskUploadsModel = mongoose.models.TaskUploads ||
    mongoose.model("TaskUploads", TaskUploadsSchema);
export default TaskUploadsModel;
