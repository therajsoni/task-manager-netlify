"use server";
import connectToDB from "./config";
import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";
import ProjectModel from "@/models/projectModel";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";
import AllRegisterUser from "@/models/RegisterAllUser";
import { sendEmail } from "./email";
import LoadHtmlModel from "@/models/LoadHtmlModel";

export const loginUser = async (userData: {
  username: string;
  password: string;
}) => {
  await connectToDB();
  try {
    const secretKey = process.env.secretkey!;
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
      id: checkUser?._id,
      identifier: checkUser?.role,
      username: checkUser?.username,
      email: checkUser?.email
    },
      secretKey,
      {
        expiresIn: '5d',
      }
    );
    checkUser.IamActiveByAdmin = true;
    await checkUser.save();
    await sendEmail({
      to: checkUser?.email, subject: "Login Successfully", text: `you logged in our ${process.env.APP_URL}`, html: `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to PManager</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      border : '1px solid black'
    }

    .header {
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      padding: 40px 20px;
      text-align: center;
      color: #fff;
    }

    .header h2 {
      margin: 0;
      font-size: 2.2em;
      font-weight: bold;
    }

    .header span {
      display: block;
      margin-top: 8px;
      font-size: 1em;
      opacity: 0.9;
    }

    .content {
      padding: 35px 30px;
      text-align: center;
      line-height: 1.7;
      background-color :linear-gradient(135deg, #2196f3, #21cbf3);
    }

    .content p {
      margin: 15px 0;
      font-size: 1.05em;
      color: #444;
    }

    .credentials {
      border: 1px solid #dce7f1;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
      text-align: left;
    }

    .credentials p {
      margin: 8px 0;
      font-size: 1.05em;
    }

    .credentials strong {
      color: #111;
    }

    .cta {
      margin-top: 25px;
    }

    .btn {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 8px;
      background: white;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background: blue;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.2);
      color : white;
    }

    .note {
      font-size: 0.95em;
      color: #666;
      margin-top: 15px;
      font-style: italic;
    }

    .footer {
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      text-align: center;
      padding: 20px;
      font-size: 0.9em;
      color: #888;
    }

    @media (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .header h2 {
        font-size: 1.8em;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to PManager 🎉</h2>
      <span>Project Management Journey Again </span>
    </div>

    <div class="content">
      <p>Hi there! You've successfully login and are ready to streamline your projects.</p>
      </div>
    <div class="footer">
      © 2025 PManager — Manage smarter, not harder.
    </div>
  </div>
</body>
</html>
      `
    })
    return {
      success: true,
      message: "Login successful",
      user: {
        id: checkUser?._id,
        username: checkUser?.username,
        password: checkUser?.password,
      },
      status: 200,
      token: token,
    };

  } catch (error) {
    return {
      success: false,
      message: "Login failed. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
};
export const checkIsUserHavaToken = async () => {
  try {
    let cookie: any = await cookies();
    if (cookie?.get("token")) {
      const token = await cookie?.get("token")?.value;
      if (token !== undefined && token !== "") {
        const isCheckTokenRelatedToApp = jsonwebtoken.verify(`${token}`, process.env?.secretkey || "nextapp");
        console.log(isCheckTokenRelatedToApp, "token");
        if (isCheckTokenRelatedToApp) {
          if (typeof isCheckTokenRelatedToApp === "string" || !("identifier" in isCheckTokenRelatedToApp)) {
            return {
              message: "You have invalid token",
              success: false,
              status: 404,
              error: null,
            };
          }
          // also check that IamActiveByAdmin is true or not  
          const IamActiveByAdmin = await AllRegisterUser.findById(isCheckTokenRelatedToApp?.id);
          if (!IamActiveByAdmin || IamActiveByAdmin?.IamActiveByAdmin === false) {
            return false;
          }
          return {
            status: true,
            identifier: isCheckTokenRelatedToApp?.identifier,
            username: isCheckTokenRelatedToApp?.username
          };
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else return false;
  } catch (error) {
    return false;
  }
}
export const createProject = async (data: {
  name: string,
  description: string,
  client: string,
  projectManager: string,
}) => {
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
      }
    }
    const cookie = await cookies();
    const cookieValue = cookie.get("token")?.value;
    if (!cookieValue || cookieValue === null || cookieValue === undefined || cookieValue === "") {
      return {
        message: "Project Creator have not token",
        success: false,
        status: 404,
        error: null,
      }
    } else {
      const secretKey = process.env.secretkey!;
      const decodeCreater = jsonwebtoken.verify(cookieValue, secretKey);
      if (!decodeCreater) {
        return {
          message: "Project Creator have not valid token",
          success: false,
          status: 404,
          error: null,
        }
      } else {
        if (typeof decodeCreater === "string" || !("id" in decodeCreater)) {
          return {
            message: "Project Creator has invalid token",
            success: false,
            status: 404,
            error: null,
          };
        }
        const authorId = decodeCreater?.id;
        const newProject: any = await ProjectModel.create({
          name,
          description,
          client,
          by: authorId,
          projectManager
        });
        // Email Send
        await sendEmail({
          to: decodeCreater?.email,
          subject: `You successfully created ${name} project 🔥`,
          text: `Successfully created a new project: ${name}`,
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Project Created</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .header {
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      padding: 40px 20px;
      text-align: center;
      color: #fff;
    }

    .header h2 {
      margin: 0;
      font-size: 2.2em;
      font-weight: bold;
    }

    .header span {
      display: block;
      margin-top: 8px;
      font-size: 1em;
      opacity: 0.9;
    }

    .content {
      padding: 35px 30px;
      text-align: center;
      line-height: 1.7;
    }

    .content p {
      margin: 15px 0;
      font-size: 1.05em;
      color: #444;
    }

    .highlight {
      background: #f4f8fb;
      border: 1px solid #dce7f1;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
    }

    .highlight strong {
      color: #111;
      font-size: 1.2em;
    }

    .cta {
      margin-top: 25px;
    }

    .btn {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background: linear-gradient(135deg, #1976d2, #00bcd4);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.2);
    }

    .footer {
      background: #f8f9fb;
      text-align: center;
      padding: 20px;
      font-size: 0.9em;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Project Created 🎉</h2>
      <span>You’re ready to build something amazing!</span>
    </div>

    <div class="content">
      <p>Congratulations! You’ve successfully created a new project in <strong>PManager</strong>.</p>
      
      <div class="highlight">
        <p><strong>Project Name:</strong> ${name}</p>
      </div>

      <div class="cta">
        <a href=${process.env.APP_URL} target="_blank" class="btn">
          Open Project Dashboard
        </a>
      </div>
    </div>

    <div class="footer">
      © 2025 PManager — Manage smarter, not harder.
    </div>
  </div>
</body>
</html>`
        });

        const projectManagerEmailSend = await AllRegisterUser.findById(projectManager).select("email");
        console.log(projectManagerEmailSend, "email");

        if (projectManagerEmailSend) {
          const objSendEmail: {
            to: string,
            text: string,
            subject: string,
            html: string
          } = {
            to: projectManagerEmailSend?.email, subject: "New Project 🔥", text: `You are the project manager of ${newProject?.name}`, html: `<!DOCTYPE html>
<html lang="en">
<head> ... (same styles as above) ... </head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Project Assigned 🔥</h2>
      <span>You’re leading this project to success!</span>
    </div>

    <div class="content">
      <p>You have been assigned as the <strong>Project Manager</strong> for a new project:</p>
      <div class="highlight">
        <p><strong>Project Name:</strong> ${newProject?.name}</p>
      </div>
      <div class="cta">
        <a href=${process.env.APP_URL} target="_blank" class="btn">
          View Project Dashboard
        </a>
      </div>
    </div>

    <div class="footer">
      © 2025 PManager — Manage smarter, not harder.
    </div>
  </div>
</body>
</html>`
          }
          await sendEmail(objSendEmail);
        }
        return {
          message: "Project Created",
          success: true,
          status: 201,
          data: newProject,
        }
      }
    }
  } catch (error) {
    return {
      message: "Server Error",
      status: 500,
      success: false,
      error: error
    }
  }
}
export const getAllProject = async () => {
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
    const cookieValue = cookie.get("token")?.value;
    if (!cookieValue || cookieValue === undefined || cookieValue === null || cookieValue === "") {
      return {
        message: "Member have not token",
        success: false,
        status: 404,
        error: null,
      }
    }
    const secretKey = process.env.secretkey!;
    const decodeCreater = jsonwebtoken.verify(cookieValue, secretKey);
    if (!decodeCreater) {
      return {
        message: "Project Creator have not valid token",
        success: false,
        status: 404,
        error: null,
      }
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
    const loginUserIdentifier = await AllRegisterUser.findOne({ username: authorId?.username });
    // filter
    //allow Access -> 
    // 1.creator as by 
    // 2.core-admin 
    // 3. department-admin 
    // 4. projectManager
    // 5. project Member
    const newResult = result.filter((project) => {
      const creatorMatch = project.by?._id.toString() === authorId.id;
      const isAdmin = ["core-admin", "department-admin"].includes(loginUserIdentifier?.role);
      const isManager = project.projectManager?.toString() === authorId.id;
      const groupMembers = project.group?.map((g: any) => g.member);
      const isGroupMember = groupMembers?.includes(authorId.username);
      return creatorMatch || isAdmin || isManager || isGroupMember;
    });
    return {
      message: "project getted Successfully",
      status: 200,
      success: true,
      data: newResult
    }
  } catch (error) {
    return {
      message: "Server Error",
      status: 500,
      success: false,
      error: error
    }
  }
}
export const getProjectByName = async (name: string) => {
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
    }
  } catch (error) {
    return {
      message: "Server Error",
      status: 500,
      success: false,
      error: error
    }
  }
}
export const getProjectById = async (id: string) => {
  try {
    await connectToDB();
    const result = await ProjectModel.findOne({
      _id: id
    }).populate({
      path: "group",
      populate: {
        path: 'username'
      }
    })
    if (!result) {
      return {
        message: "Not Found Error",
        status: 400,
        success: false,
        error: null
      }
    }
    return {
      message: "project getted by id Successfully",
      status: 200,
      success: true,
      data: result
    }
  } catch (error) {
    return {
      message: "Server Error",
      status: 500,
      success: false,
      error: error
    }
  }
}
export const patchProjectByid = async (data: {
  id: string,
  name?: string,
  description?: string,
  status?: string,
  client?: string
}) => {
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
      }
    }
    const projectOldName = result?.name;
    if (data) {
      if (data.name) {
        result.name = data.name;
        const task = await fallbackTaskModel.findOne({
          projectId: data.id
        });
        if (task) {
          task.data[0].name = data.name
        }
      }
      if (data.client) {
        result.client = data.client
      }
      if (data.status) {
        result.status = data.status
      }
      if (data.description) {
        result.description = data.description
      }
      const cookie = await cookies();
      const cookieValue = cookie.get("token")?.value;
      if (!cookieValue || cookieValue === null || cookieValue === undefined || cookieValue === "") {
        return {
          message: "Project Updator have not token",
          success: false,
          status: 404,
          error: null,
        }
      } else {
        const secretKey = process.env.secretkey!
        const decodeCreater = jsonwebtoken.verify(cookieValue, secretKey);
        if (!decodeCreater) {
          return {
            message: "Project Updator have not valid token",
            success: false,
            status: 404,
            error: null,
          }
        } else {
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
          }]
        }
      }
      const newData = await result.save();
      // tasks description, Editor and proEditor both update, in task one field His
      // editor task update 
      // if (data && data?.name) {
      //   const editors = await LoadHtmlModel.find({}).select("key");
      //   await Promise.all(
      //     editors?.map(async (editorDoc) => {
      //       const [projName, taskName] = editorDoc?.key?.split("#$#");
      //       if (projName === projectOldName) {
      //         editorDoc.key = `${newData?.name}#$#${taskName}`;
      //         await editorDoc.save();
      //       }
      //     })
      //   );
      // }
      return {
        message: "Data updated",
        status: 200,
        success: true,
        error: null,
        data: newData,
      }

    }
  }
  catch (error) {
    return {
      message: "Server Error",
      status: 500,
      success: false,
      error: error
    }
  }
}
export const deleteProjectById = async (id: string) => {
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
      }
    }
    await ProjectModel.deleteOne({
      _id: id
    })
    return {
      message: "project deleted by id Successfully",
      status: 200,
      success: true,
      data: result
    }
  } catch (error) {
    return {
      message: "Server Error",
      status: 500,
      success: false,
      error: error
    }
  }
}
export const createGroupTeamOfProject = async (data: string[], id: string) => {
  await connectToDB();
  try {
    let project = await ProjectModel.findById(id);
    if (!project) {
      return {
        message: "Project Not Found",
        error: null,
        success: false,
        status: 404,
      }
    }
    let arrOfMembers = project?.group?.map((m: { member: string, time: Date, }) => m.member);
    let uniquePersons = project?.group;
    await data?.map(async (m: string) => {
      if (!arrOfMembers.includes(m)) {
        arrOfMembers?.push(m);
        uniquePersons?.push({
          member: m,
          time: new Date(),
        });
        const emailSend = await AllRegisterUser.findOne({
          username: m
        });
        await sendEmail({ to: emailSend?.email, subject: `🔥 You Are Project Member of ${project?.name}`, text: 'You are added in this project please kindly focus on tasks section on your workspace and tasks list, there project manager of this project and also admin send to task when that is completed show to your assisgn of task and update of your task', html: '<h1>All the Best</h1>' })
      }
    });
    await ProjectModel.updateOne({ _id: id }, {
      group: uniquePersons
    });
    return {
      data: project,
      message: "Added",
      error: null,
      success: true,
      status: 200,
    }
  } catch (error) {
    return {
      message: "Server Error",
      error: error,
      success: false,
      status: 500,
    }
  }
}
export const selecteProjectValidUsers = async (id: string) => {
  try {
    await connectToDB();
    let project = await ProjectModel.findById(id);
    if (!project) {
      return {
        message: "Users Not Found",
        error: null,
        success: false,
        status: 404,
      }
    }
    let allLoginUser = await AllRegisterUser.find({});
    const projectUsers = project?.group?.map((item: any) => {
      return item?.member;
    })
    allLoginUser = allLoginUser.filter((item) => {
      console.log(projectUsers?.includes(item.username));

      return !projectUsers?.includes(item.username);
    });
    return {
      message: "user getted",
      error: null,
      success: true,
      status: 200,
      data: allLoginUser,
    }
  } catch (error) {
    return {
      message: "Server Error",
      error: error,
      success: false,
      status: 500,
    }
  }
}