import mongoose from "mongoose";

export const AttachmentSchema = new mongoose.Schema(
    {
        projectId: { type: String },
        public_id: { type: String },
        secure_url: { type: String },
        format: { type: String },
        resource_type: { type: String },
        bytes: { type: Number },
        original_filename: { type: String },
        uploader: { type: mongoose.Schema.Types.ObjectId, ref : "RegisterUsers" },
        savedFileName : String,
        preview_url : String
    }
);

const AttachmentSchemaModel = mongoose.models.AttachmentSchemaModel || mongoose.model("AttachmentSchemaModel", AttachmentSchema);
export default AttachmentSchemaModel;