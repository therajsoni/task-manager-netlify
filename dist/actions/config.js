import mongoose from "mongoose";
const connectToDB = async () => {
    try {
        const url = await mongoose.connect("mongodb://appadm:ad%400808@110.227.194.109:2738"
        // "mongodb://localhost:27017/dbfallback"
        );
        console.log("Connected to MongoDB:", url.connection.host);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
export default connectToDB;
