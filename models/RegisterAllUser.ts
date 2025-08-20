import mongoose from "mongoose";

const RegisterAllUser = new mongoose.Schema({
    name : String,
    username : String,
    email : String,
    phone : String,
    role : String,
    password : String,
});

const AllRegisterUser = mongoose.models.RegisterUsers || mongoose.model("RegisterUsers",RegisterAllUser);
export default AllRegisterUser;