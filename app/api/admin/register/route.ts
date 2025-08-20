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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to P Manager</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">
  <style>
    body {
      font-family: 'Roboto', sans-serif; /* Use a modern font like Roboto. */
      background-color: #e0f2f7; /* A lighter, more pleasant background color */
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh; /* Ensure the content is centered vertically */
      color: #333;
    }
    .container {
      max-width: 500px; /* Slightly adjusted max-width for better balance */
      margin: 20px; /* Add some margin for smaller screens */
      background-color: #ffffff;
      padding: 40px;
      border-radius: 12px; /* Smoother border-radius */
      box-shadow: 0 4px 20px rgba(0,0,0,0.1); /* Enhanced shadow for depth */
      text-align: center; /* Center the content within the container */
    }
    h2 {
      color: #2196f3; /* A vibrant blue for the heading */
      margin-bottom: 20px;
      font-size: 2.2em; /* Increase heading size */
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1); /* Subtle text shadow */
    }
    h2 span {
        display: block;
        font-size: 0.6em;
        font-weight: normal;
        color: #757575;
        margin-top: 5px;
    }
    p {
      font-size: 1.1em;
      line-height: 1.6; /* Improve readability with line-height */
      margin: 15px 0;
    }
    strong {
      color: #424242;
    }
    .call-to-action {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eeeeee;
    }
    .call-to-action h3 {
        color: #2196f3;
        margin-bottom: 15px;
        font-size: 1.5em;
    }
    .btn {
      display: inline-block;
      background-color: #2196f3;
      color: #ffffff;
      padding: 12px 25px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth hover effects */
      margin-top: 10px;
    }
    .btn:hover {
      background-color: #1976d2;
      transform: translateY(-2px); /* Slight lift on hover */
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .note {
      font-size: 0.95em;
      color: #757575;
      margin-top: 20px;
      font-style: italic; /* Use italics for the note */
    }
    img {
      max-width: 100%;
      height: auto;
      margin-bottom: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); /* Add a subtle shadow to the image */
    }
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .container {
            margin: 15px;
            padding: 30px;
        }
        h2 {
            font-size: 2em;
        }
        p {
            font-size: 1em;
        }
    }
    @media (max-width: 480px) {
        .container {
            margin: 10px;
            padding: 20px;
        }
        h2 {
            font-size: 1.8em;
        }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to PManager 🎉<br><span>Your Project Management Journey Begins!</span></h2>
    <p>Hi there! You've successfully registered and are ready to streamline your projects.</p>
    <p>We've created a temporary account for you. Please use the following credentials to log in:</p>
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>Password:</strong> ${password}</p>
    
    <div class="call-to-action">
        <h3>Time to get started!</h3>
        <p class="note">This is a temporary password. For your security, please log in and change it immediately.</p>
        <a href="https://aonprojectmanagement.netlify.app" target="_blank" class="btn">Visit Your Dashboard Now</a>
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
