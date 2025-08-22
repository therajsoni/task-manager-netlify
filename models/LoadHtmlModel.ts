import mongoose from "mongoose";
const LoadHtml = new mongoose.Schema({
    key: String,
    html: String,
    uploader: {type : mongoose.Schema.Types.ObjectId, ref : "RegisterUsers"},
    createdAt: {
        type: Date,
        default: new Date()
    },
    uploadAt: {
        type: Date,
        default: new Date()
    },
    updatedBy : String,
    updatedAt : {
        type: Date,
        default: new Date()
        
    }
});
const LoadHtmlModel = mongoose.models.LoadHtmlModel || mongoose.model("LoadHtmlModel", LoadHtml);
export default LoadHtmlModel;