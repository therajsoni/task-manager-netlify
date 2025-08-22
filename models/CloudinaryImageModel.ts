import mongoose, { Schema } from "mongoose";
export interface ICloudinaryFile extends Document {
    public_id: string;        // Cloudinary file ID
    secure_url: string;       // Full secure URL
    format: string;           // jpg, png, pdf, etc.
    resource_type: string;    // image, video, raw
    bytes: number;            // file size in bytes
    original_filename: string;// original file name
    createdAt: Date;
}

const CloudinaryFileSchema = new Schema<ICloudinaryFile>(
    {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
        format: { type: String, required: true },
        resource_type: { type: String, required: true },
        bytes: { type: Number, required: true },
        original_filename: { type: String, required: true },
    },
    { timestamps: true }
);
const CloudinaryImage = new mongoose.Schema({
    key: String,
    name: String,
    description: String,
    ImageService: [CloudinaryFileSchema],
    uploader: mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: new Date()
    },
    uploadAt: {
        type: Date,
        default: new Date()
    },
});
const CloudinaryImageModel = mongoose.model("CloudinaryImageModel", CloudinaryImage);
export default CloudinaryImageModel;