import mongoose from "mongoose";
const TaskFeatures = new mongoose.Schema({
    key: String,
    features: [{
        key: String,
        value: Boolean,
        data: String,
    }]
})
const TaskFeaturesModel = mongoose.models.TaskFeaturesModel || mongoose.model("TaskFeaturesModel", TaskFeatures);
export default TaskFeaturesModel