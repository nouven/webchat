const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    name: String,
    email: String,
    password: String,
    friends: [String],
    friendReqs:[String],
    keys:[String],
    cookie:[String],
    // lastTime: [number],
    avatar:{
        type: String,
        default: "https://raw.githubusercontent.com/TonTon69/Dashboard_UI/main/assets/img/giphy.gif",
    }
},{
    timestamps: true
});
module.exports = mongoose.model('users', user);