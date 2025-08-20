import connectToDB from "@/actions/config"
import ProjectModel from "@/models/projectModel";
import AllRegisterUser from "@/models/RegisterAllUser";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";

export async function GET() {
    try {
        await connectToDB();
        const cookie = await cookies();
        const secretKey = process.env.secretkey || "nextapp";
        const decodeData = jsonwebtoken.verify(`${cookie?.get("token")?.value}`, secretKey)
        if (typeof decodeData === "string") {
            return Response.json({
                error: null, data: null, status: 404, success: false, message: "you id is mismatch in work space fetching time",
            })
        }        
        if (!mongoose.isValidObjectId(decodeData?.id)) {
            return Response.json({
                error: null, data: null, status: 404, success: false, message: "id is not valid",
            })
        }
        const RegisterUser = await AllRegisterUser.findById(decodeData?.id).select("username");
        if (!RegisterUser) {
            return Response.json({
                error: null, data: null, status: 404, success: false, message: "user not found by this id",
            })
        }
        const objectId = new mongoose.Types.ObjectId(decodeData?.id);
        const pipeline = [
            // Match projects where userId is involved
            {
                $match: {
                    $or: [
                        { by: objectId },
                        { projectManager: objectId },
                        { "group.member": objectId }
                    ]
                }
            },

            // Populate "by"
            {
                $lookup: {
                    from: "registerusers",
                    localField: "by",
                    foreignField: "_id",
                    as: "by"
                }
            },
            { $unwind: { path: "$by", preserveNullAndEmptyArrays: true } },

            // Populate "projectManager"
            {
                $lookup: {
                    from: "registerusers",
                    localField: "projectManager",
                    foreignField: "_id",
                    as: "projectManager"
                }
            },
            { $unwind: { path: "$projectManager", preserveNullAndEmptyArrays: true } },

            // Populate "group.member"
            {
                $lookup: {
                    from: "registerusers",
                    localField: "group.member",
                    foreignField: "_id",
                    as: "groupMemberDetails"
                }
            },

            // Determine registration details and project role
            {
                $addFields: {
                    registration: {
                        $cond: [
                            { $eq: ["$by._id", objectId] },
                            "$by",
                            {
                                $cond: [
                                    { $eq: ["$projectManager._id", objectId] },
                                    "$projectManager",
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$groupMemberDetails",
                                                    as: "gm",
                                                    cond: { $eq: ["$$gm._id", objectId] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    role: {
                        $cond: [
                            { $eq: ["$by._id", objectId] },
                            "creator",
                            {
                                $cond: [
                                    { $eq: ["$projectManager._id", objectId] },
                                    "projectManager",
                                    "$role" // fallback to stored project role
                                ]
                            }
                        ]
                    }
                }
            },
            // Split output into totals, list, and registration
            {
                $facet: {
                    totalData: [
                        {
                            $group: {
                                _id: null,
                                totalProjects: { $sum: 1 },
                                totalCompleted: {
                                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                                },
                                totalCurrent: {
                                    $sum: { $cond: [{ $ne: ["$status", "completed"] }, 1, 0] }
                                },
                                roles: { $addToSet: "$role" }
                            }
                        }
                    ],
                    projectListData: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                role: 1,
                                added: "$createdAt"
                            }
                        }
                    ],
                    registrationData: [
                        {
                            $project: {
                                _id: 0,
                                registration: 1
                            }
                        }
                    ]
                }
            },
            // Format into single object
            {
                $project: {
                    registration: { $arrayElemAt: ["$registrationData.registration", 0] },
                    totalData: { $arrayElemAt: ["$totalData", 0] },
                    projectListData: "$projectListData"
                }
            }
        ];
        const projects = await ProjectModel.aggregate(pipeline);
        return Response.json({
            error: null, data: projects, status: 200, success: true, message: "Data getted successfully",
        })
    } catch (error) {
        return Response.json({
            error, data: null, status: 500, success: false, message: "Server Error Occured",
        })
    }
}