"use server";
import connectToDB from "./config";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";
import ProjectModel from "@/models/projectModel";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";
import AllRegisterUser from "@/models/RegisterAllUser";
import { sendEmail } from "./email";
export const loginUser = async (userData) => {
    await connectToDB();
    try {
        const secretKey = process.env.secretkey;
        const { username, password } = userData;
        const checkUser = await AllRegisterUser.findOne({
            $and: [
                { username },
                { password }
            ]
        });
        if (!checkUser) {
            return {
                success: false,
                message: "User not found by username and password",
                error: null,
                status: 400,
            };
        }
        // let isUserNameExists = await LoginModel.findOne({ username });
        // if (!isUserNameExists) {
        //   isUserNameExists = await LoginModel.create({ username, password });
        // }
        // await LoginModel.findByIdAndUpdate(
        //   isUserNameExists?._id,
        //   {
        //     identifier: checkUser?.role
        //   },
        //   {
        //     new: true
        //   }
        // );
        const token = jsonwebtoken.sign({
            id: checkUser === null || checkUser === void 0 ? void 0 : checkUser._id,
            identifier: checkUser === null || checkUser === void 0 ? void 0 : checkUser.role,
            username: checkUser === null || checkUser === void 0 ? void 0 : checkUser.username,
            email: checkUser === null || checkUser === void 0 ? void 0 : checkUser.email
        }, secretKey, {
            expiresIn: '5d',
        });
        return {
            success: true,
            message: "Login successful",
            user: {
                id: checkUser === null || checkUser === void 0 ? void 0 : checkUser._id,
                username: checkUser === null || checkUser === void 0 ? void 0 : checkUser.username,
                password: checkUser === null || checkUser === void 0 ? void 0 : checkUser.password,
            },
            status: 200,
            token: token,
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Login failed. Please try again.",
            error: error instanceof Error ? error.message : "Unknown error",
            status: 500,
        };
    }
};
export const checkIsUserHavaToken = async () => {
    var _a, _b;
    try {
        let cookie = await cookies();
        if (cookie === null || cookie === void 0 ? void 0 : cookie.get("token")) {
            const token = await ((_a = cookie === null || cookie === void 0 ? void 0 : cookie.get("token")) === null || _a === void 0 ? void 0 : _a.value);
            if (token !== undefined && token !== "") {
                const isCheckTokenRelatedToApp = jsonwebtoken.verify(`${token}`, ((_b = process.env) === null || _b === void 0 ? void 0 : _b.secretkey) || "nextapp");
                if (isCheckTokenRelatedToApp) {
                    if (typeof isCheckTokenRelatedToApp === "string" || !("identifier" in isCheckTokenRelatedToApp)) {
                        return {
                            message: "Project Creator has invalid token",
                            success: false,
                            status: 404,
                            error: null,
                        };
                    }
                    return {
                        status: true,
                        identifier: isCheckTokenRelatedToApp === null || isCheckTokenRelatedToApp === void 0 ? void 0 : isCheckTokenRelatedToApp.identifier,
                        username: isCheckTokenRelatedToApp === null || isCheckTokenRelatedToApp === void 0 ? void 0 : isCheckTokenRelatedToApp.username
                    };
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else
            return false;
    }
    catch (error) {
        return false;
    }
};
export const createProject = async (data) => {
    var _a;
    try {
        await connectToDB();
        const { name, description, client, projectManager } = data;
        const checkProjectByNameExists = await ProjectModel.findOne({
            name
        });
        if (checkProjectByNameExists) {
            return {
                message: "Project By This Name Already Exists",
                success: false,
                status: 404,
                error: null,
            };
        }
        const cookie = await cookies();
        const cookieValue = (_a = cookie.get("token")) === null || _a === void 0 ? void 0 : _a.value;
        if (!cookieValue || cookieValue === null || cookieValue === undefined || cookieValue === "") {
            return {
                message: "Project Creator have not token",
                success: false,
                status: 404,
                error: null,
            };
        }
        else {
            const secretKey = process.env.secretkey;
            const decodeCreater = jsonwebtoken.verify(cookieValue, secretKey);
            if (!decodeCreater) {
                return {
                    message: "Project Creator have not valid token",
                    success: false,
                    status: 404,
                    error: null,
                };
            }
            else {
                if (typeof decodeCreater === "string" || !("id" in decodeCreater)) {
                    return {
                        message: "Project Creator has invalid token",
                        success: false,
                        status: 404,
                        error: null,
                    };
                }
                const authorId = decodeCreater === null || decodeCreater === void 0 ? void 0 : decodeCreater.id;
                const newProject = await ProjectModel.create({
                    name,
                    description,
                    client,
                    by: authorId,
                    projectManager
                });
                // Email Send
                await sendEmail({
                    to: decodeCreater === null || decodeCreater === void 0 ? void 0 : decodeCreater.email,
                    subject: `you successfully created ${name} project 🔥`,
                    text: 'Successfully created a new project',
                    html: `<h1>${name} Project for All the best</h1>`
                });
                const projectManagerEmailSend = await AllRegisterUser.findById(projectManager).select("email");
                console.log(projectManagerEmailSend, "email");
                if (projectManagerEmailSend) {
                    const objSendEmail = {
                        to: projectManagerEmailSend === null || projectManagerEmailSend === void 0 ? void 0 : projectManagerEmailSend.email, subject: "New Project 🔥", text: `You are the project manager of ${newProject === null || newProject === void 0 ? void 0 : newProject.name}`, html: ''
                    };
                    await sendEmail(objSendEmail);
                }
                return {
                    message: "Project Created",
                    success: true,
                    status: 201,
                    data: newProject,
                };
            }
        }
    }
    catch (error) {
        return {
            message: "Server Error",
            status: 500,
            success: false,
            error: error
        };
    }
};
export const getAllProject = async () => {
    var _a;
    try {
        await connectToDB();
        const result = await ProjectModel.find({}).select("name description client status createdAt group by").populate({
            path: "by",
            select: "username _id"
        })
            .populate({
            path: "projectManager",
            select: "username _id"
        })
            .sort({
            createdAt: -1
        });
        const cookie = await cookies();
        const cookieValue = (_a = cookie.get("token")) === null || _a === void 0 ? void 0 : _a.value;
        if (!cookieValue || cookieValue === undefined || cookieValue === null || cookieValue === "") {
            return {
                message: "Member have not token",
                success: false,
                status: 404,
                error: null,
            };
        }
        const secretKey = process.env.secretkey;
        const decodeCreater = jsonwebtoken.verify(cookieValue, secretKey);
        if (!decodeCreater) {
            return {
                message: "Project Creator have not valid token",
                success: false,
                status: 404,
                error: null,
            };
        }
        if (typeof decodeCreater === "string" || !("id" in decodeCreater)) {
            return {
                message: "Project Creator has invalid token",
                success: false,
                status: 404,
                error: null,
            };
        }
        const authorId = decodeCreater;
        // cock
        const loginUserIdentifier = await AllRegisterUser.findOne({ username: authorId === null || authorId === void 0 ? void 0 : authorId.username });
        // filter
        //allow Access -> 
        // 1.creator as by 
        // 2.core-admin 
        // 3. department-admin 
        // 4. projectManager
        // 5. project Member
        const newResult = result.filter((project) => {
            var _a, _b, _c;
            const creatorMatch = ((_a = project.by) === null || _a === void 0 ? void 0 : _a._id.toString()) === authorId.id;
            const isAdmin = ["core-admin", "department-admin"].includes(loginUserIdentifier === null || loginUserIdentifier === void 0 ? void 0 : loginUserIdentifier.role);
            const isManager = ((_b = project.projectManager) === null || _b === void 0 ? void 0 : _b.toString()) === authorId.id;
            const groupMembers = (_c = project.group) === null || _c === void 0 ? void 0 : _c.map((g) => g.member);
            const isGroupMember = groupMembers === null || groupMembers === void 0 ? void 0 : groupMembers.includes(authorId.username);
            return creatorMatch || isAdmin || isManager || isGroupMember;
        });
        return {
            message: "project getted Successfully",
            status: 200,
            success: true,
            data: newResult
        };
    }
    catch (error) {
        return {
            message: "Server Error",
            status: 500,
            success: false,
            error: error
        };
    }
};
export const getProjectByName = async (name) => {
    try {
        await connectToDB();
        const result = await ProjectModel.findOne({
            name
        }).populate({ path: "by", select: "username" }).populate({ path: "projectManager", select: "username" });
        return {
            message: "project getted by name Successfully",
            status: 200,
            success: true,
            data: result
        };
    }
    catch (error) {
        return {
            message: "Server Error",
            status: 500,
            success: false,
            error: error
        };
    }
};
export const getProjectById = async (id) => {
    try {
        await connectToDB();
        const result = await ProjectModel.findOne({
            _id: id
        }).populate({
            path: "group",
            populate: {
                path: 'username'
            }
        });
        if (!result) {
            return {
                message: "Not Found Error",
                status: 400,
                success: false,
                error: null
            };
        }
        return {
            message: "project getted by id Successfully",
            status: 200,
            success: true,
            data: result
        };
    }
    catch (error) {
        return {
            message: "Server Error",
            status: 500,
            success: false,
            error: error
        };
    }
};
export const patchProjectByid = async (data) => {
    var _a;
    try {
        await connectToDB();
        const result = await ProjectModel.findOne({
            _id: data.id
        });
        if (!result) {
            return {
                message: "Not Found Error",
                status: 400,
                success: false,
                error: null
            };
        }
        if (data) {
            if (data.name) {
                result.name = data.name;
                const task = await fallbackTaskModel.findOne({
                    projectId: data.id
                });
                if (task) {
                    task.data[0].name = data.name;
                }
            }
            if (data.client) {
                result.client = data.client;
            }
            if (data.status) {
                result.status = data.status;
            }
            if (data.description) {
                result.description = data.description;
            }
            const cookie = await cookies();
            const cookieValue = (_a = cookie.get("token")) === null || _a === void 0 ? void 0 : _a.value;
            if (!cookieValue || cookieValue === null || cookieValue === undefined || cookieValue === "") {
                return {
                    message: "Project Updator have not token",
                    success: false,
                    status: 404,
                    error: null,
                };
            }
            else {
                const secretKey = process.env.secretkey;
                const decodeCreater = jsonwebtoken.verify(cookieValue, secretKey);
                if (!decodeCreater) {
                    return {
                        message: "Project Updator have not valid token",
                        success: false,
                        status: 404,
                        error: null,
                    };
                }
                else {
                    if (typeof decodeCreater === "string" || !("id" in decodeCreater)) {
                        return {
                            message: "Project Creator has invalid token",
                            success: false,
                            status: 404,
                            error: null,
                        };
                    }
                    result.updartors = [...(result.updartors), {
                            updator: decodeCreater.id,
                            time: new Date(),
                        }];
                }
            }
            const newData = await result.save();
            return {
                message: "Data updated",
                status: 200,
                success: true,
                error: null,
                data: newData,
            };
        }
    }
    catch (error) {
        return {
            message: "Server Error",
            status: 500,
            success: false,
            error: error
        };
    }
};
export const deleteProjectById = async (id) => {
    try {
        await connectToDB();
        const result = await ProjectModel.find({
            _id: id
        });
        if (!result) {
            return {
                message: "Not Found Error",
                status: 400,
                success: false,
                error: null
            };
        }
        await ProjectModel.deleteOne({
            _id: id
        });
        return {
            message: "project deleted by id Successfully",
            status: 200,
            success: true,
            data: result
        };
    }
    catch (error) {
        return {
            message: "Server Error",
            status: 500,
            success: false,
            error: error
        };
    }
};
export const createGroupTeamOfProject = async (data, id) => {
    var _a;
    await connectToDB();
    try {
        let project = await ProjectModel.findById(id);
        if (!project) {
            return {
                message: "Project Not Found",
                error: null,
                success: false,
                status: 404,
            };
        }
        let arrOfMembers = (_a = project === null || project === void 0 ? void 0 : project.group) === null || _a === void 0 ? void 0 : _a.map((m) => m.member);
        let uniquePersons = project === null || project === void 0 ? void 0 : project.group;
        await (data === null || data === void 0 ? void 0 : data.map(async (m) => {
            if (!arrOfMembers.includes(m)) {
                arrOfMembers === null || arrOfMembers === void 0 ? void 0 : arrOfMembers.push(m);
                uniquePersons === null || uniquePersons === void 0 ? void 0 : uniquePersons.push({
                    member: m,
                    time: new Date(),
                });
                const emailSend = await AllRegisterUser.findOne({
                    username: m
                });
                await sendEmail({ to: emailSend === null || emailSend === void 0 ? void 0 : emailSend.email, subject: `🔥 You Are Project Member of ${project === null || project === void 0 ? void 0 : project.name}`, text: 'You are added in this project please kindly focus on tasks section on your workspace and tasks list, there project manager of this project and also admin send to task when that is completed show to your assisgn of task and update of your task', html: '<h1>All the Best</h1>' });
            }
        }));
        await ProjectModel.updateOne({ _id: id }, {
            group: uniquePersons
        });
        return {
            data: project,
            message: "Added",
            error: null,
            success: true,
            status: 200,
        };
    }
    catch (error) {
        return {
            message: "Server Error",
            error: error,
            success: false,
            status: 500,
        };
    }
};
export const selecteProjectValidUsers = async (id) => {
    var _a;
    try {
        await connectToDB();
        let project = await ProjectModel.findById(id);
        if (!project) {
            return {
                message: "Users Not Found",
                error: null,
                success: false,
                status: 404,
            };
        }
        let allLoginUser = await AllRegisterUser.find({});
        const projectUsers = (_a = project === null || project === void 0 ? void 0 : project.group) === null || _a === void 0 ? void 0 : _a.map((item) => {
            return item === null || item === void 0 ? void 0 : item.member;
        });
        allLoginUser = allLoginUser.filter((item) => {
            console.log(projectUsers === null || projectUsers === void 0 ? void 0 : projectUsers.includes(item.username));
            return !(projectUsers === null || projectUsers === void 0 ? void 0 : projectUsers.includes(item.username));
        });
        return {
            message: "user getted",
            error: null,
            success: true,
            status: 200,
            data: allLoginUser,
        };
    }
    catch (error) {
        return {
            message: "Server Error",
            error: error,
            success: false,
            status: 500,
        };
    }
};
