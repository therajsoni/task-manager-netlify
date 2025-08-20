import mongoose from "mongoose";
const MessageContainer = new mongoose.Schema({
    key: String,
    messageText: String,
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUsers",
    },
    createdAt: Date,
}, {
    timestamps: true,
});
const MessageContainerModel = mongoose.models.MessageContainerModel || mongoose.model("MessageContainerModel", MessageContainer);
export default MessageContainerModel;
