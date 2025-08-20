import mongoose from "mongoose";

const fallbackTask = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Project",
    },
    data: []
});

export const fallbackTaskModel = mongoose.models.fallbackTask || mongoose.model("fallbackTask",fallbackTask);