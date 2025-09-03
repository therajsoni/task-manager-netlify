import mongoose from "mongoose";

const RegisterAllUser = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        lowercase: true,
        trim: true
    },
    email: String,
    phone: String,
    role: String,
    password: String,
    // login time true and logout time false and also render it in Page
    IamActiveByAdmin: Boolean,
});

const AllRegisterUser = mongoose.models.RegisterUsers || mongoose.model("RegisterUsers", RegisterAllUser);
export default AllRegisterUser;