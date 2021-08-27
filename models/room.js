
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    userId: String,
    name: String,
    content: String,
},{
    timestamps: true,
})

const room = new Schema({
    name: String,
    users: [String],
    messages:[message],
    type: {
        type: Number,
        default: 1,
    },
    avatar:{
        type: String,
        default: 'https://www.bigideasfest.org/sites/default/files/imagecache/group_images_showcase/default-group.png'
    }
},{
    timestamps: true,
});
module.exports = mongoose.model('rooms', room);