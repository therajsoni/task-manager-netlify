import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    text: {
        title: String,
        description: String,
    },
    type: {
        type: String,
        enum: ['alert', 'group', 'custom'],
        default: 'custom',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUsers"
    },
    members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "RegisterUsers"
        }],
    project: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        name: String
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegisterUsers"
    },
    keyName: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});
const MessageModel = mongoose.models.MessageModel || mongoose.model("MessageModel", MessageSchema);
export default MessageModel;
