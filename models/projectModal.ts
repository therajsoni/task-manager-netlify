const mongoose = require("mongoose");

const Main = new mongoose.Schema({
    project_name : String,
    addItems : [],
});

const MainModel = mongoose.model("main",Main);
module.exports = {
    MainModel,
}