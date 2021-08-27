const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    name: String,
    email: String,
    password: String,
    friends: [String],
    friendReqs:[String],
    rooms: {
        type: Array,
        default:["6126751a711da7dbbd358799", "6126751a711da7dbbd35879a"]
    },
    keys:[String],
    avatar:{
        type: String,
        default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
    }
},{
    timestamps: true
});
module.exports = mongoose.model('users', user);