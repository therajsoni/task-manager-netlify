// models/TaskModel.ts
import mongoose from "mongoose";

const SubtaskSchema = new mongoose.Schema({
  name: String,
  assignedTo: String,
  status: {
    type: String,
    // enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  startDate: Date,
  endDate: Date,
  children: [this]  // recursive nesting
});

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  name: { type: String, required: true },
  assignedTo: String,
  status: {
    type: String,
    // enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  startDate: Date,
  endDate: Date,
  children: [SubtaskSchema]
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
