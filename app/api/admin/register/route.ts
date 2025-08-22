import connectToDB from "@/actions/config";
import AllRegisterUser from "../../../../models/RegisterAllUser";
import { sendEmail } from "@/actions/email";
import projectlogo from "../../../../public/project-aon-logo.png";

export async function POST(request: Request) {
    try {
        await connectToDB();
        const body = await request.json();
        const requiredFields = [
            "name", "username", "phone", "email", "role", "password"
        ]
        const checkJSON = requiredFields?.every((field) => field in body?.data);
        if (!checkJSON) {
            return Response.json({
                error: null,
                message: "All fields neccessary",
                status: 404,
                success: false,
                data: null,
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        for (const key in body?.data) {
            if (!Object.prototype.hasOwnProperty.call(body.data, key)) continue;
            const value = body.data[key as keyof typeof body.data];
            if (key === "password") continue;
            if (!value || String(value).trim().length === 0) {
                return Response.json({
                    error: null,
                    message: "All fields are necessary",
                    status: 404,
                    success: false,
                    data: null,
                });
            }
            if (key === "email" && !emailRegex.test(String(value))) {
                return Response.json({
                    error: null,
                    message: "Email not valid",
                    status: 404,
                    success: false,
                    data: null,
                });
            }
            if (
                key === "phone" &&
                (!/^\d{10}$/.test(String(value)) || String(value).charAt(0) === "0")
            ) {
                return Response.json({
                    error: null,
                    message: "Phone number not valid",
                    status: 404,
                    success: false,
                    data: null,
                });
            }
        }
        const {
            name, username, email, password, role, phone
        } = body?.data;
        const checkUser = await AllRegisterUser.findOne({
            $or: [{
                name,
            },
            {
                username
            }]
        });
        if (checkUser) {
            return Response.json({
                error: null,
                message: "Duplicate Name or Username by this Already Exists please choose another ones",
                status: 404,
                success: false,
                data: null,
            })
        }
        const user = await AllRegisterUser.create({
            name,
            username,
            phone,
            email,
            password,
            role,
        });
        await sendEmail({
            to: email,
            subject: "You are registered in pManager",
            text: "Registered",
            html: `<!DOCTYPE html>
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
      <span>Your Project Management Journey Begins!</span>
    </div>

    <div class="content">
      <p>Hi there! You've successfully registered and are ready to streamline your projects.</p>
      <p>We've created a temporary account for you. Please use the following credentials to log in:</p>
      
      <div class="credentials">
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <div class="cta">
        <a href=${process.env.APP_URL} target="_blank" class="btn">
          Visit Your Dashboard Now
        </a>
        <p class="note">This is a temporary password. For your security, please log in and change it immediately.</p>
      </div>
    </div>

    <div class="footer">
      © 2025 PManager — Manage smarter, not harder.
    </div>
  </div>
</body>
</html>
`
        })
        return Response.json({
            error: null,
            message: `Registered ${name}`,
            status: 201,
            success: true,
            data: {
                password: "",
                ...user
            },
        });
    } catch (error) {
        return Response.json({
            error: error,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: null,
        })
    }
}
export async function GET() {
    try {
        await connectToDB();
        const data = await AllRegisterUser.find({});
        return Response.json({
            error: null,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: data,
        })
    } catch (error) {
        return Response.json({
            error: error,
            message: "Internal Server Error",
            status: 500,
            success: false,
            data: null,
        })
    }
}
