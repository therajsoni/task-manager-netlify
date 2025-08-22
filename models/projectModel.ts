import mongoose, { CallbackError } from "mongoose";
// import LoginModel from "./loginModel";
import AllRegisterUser from "./RegisterAllUser";
import { AttachmentSchema } from "./Attachments";



const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        client: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: false,
            // enum: ["ongoing", "pending", "completed"],
            default: "pending"
        },
        by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "RegisterUsers"
        },
        description: {
            type: String,
            required: false,
            default: "It is a very good project",
        },
        group: [
            {
                member: {
                    type: String,
                    required: false,
                    ref: "RegisterUsers",
                    trim: true,
                },
                time: {
                    type: Date,
                    default: new Date()
                },
                // identifier: {
                //     type: String,
                //     default: null,
                //     // head
                // }
            },
        ],
        updartors: [
            {
                updator: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: "RegisterUsers"
                },
                time: {
                    type: Date,
                    default: new Date()
                }
            },

        ],
        projectManager: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "RegisterUsers"
        },
        attachments: [AttachmentSchema]
    },
    { timestamps: true }
);

ProjectSchema.pre("save", async function (next) {
    if (this.isNew) {
        const findUser = await AllRegisterUser.findById(this.by);
        const findManager = await AllRegisterUser.findById(this.projectManager);
        console.log(findUser, "90009");
        console.log(findManager, "999999");
        if (findUser) {
            this.group.push({
                member: findUser.username,
                time: new Date(),
                identifier: findUser.role,
            });
        }
        if (findManager) {
            if (findManager?.username !== findUser?.username) {
                this.group.push({
                    member: findManager.username,
                    time: new Date(),
                    // identifier: "head",
                });
            }
        }
    }
    next();
});

const ProjectModel = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default ProjectModel;