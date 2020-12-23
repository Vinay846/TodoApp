const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userName: String,
    password: String
});
const todoSchema = new mongoose.Schema({
    task: String,
    done: Boolean,
    creationTime: Date,
    userId: mongoose.Schema.Types.ObjectId
});

const userModel = mongoose.model("user", userSchema);
const todoModel = mongoose.model("todo", todoSchema);

module.exports = {
    userModel: userModel,
    todoModel: todoModel
};
