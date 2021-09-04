
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    //_id is user_id of ownmess;
    _id: String,
    name: String,
    avatar: String,
    content: String,
},{
    timestamps: true,
})
const user = new Schema({
    _id: String,
    unSeenMess:{
        default: 0,
        type: 'Number'
    } 
})

const room = new Schema({
    name: String,
    users: [user],
    messages:[message],
    type: {
        type: Number,
        default: 1,
    },
    avatar:{
        type: String,
        default: 'https://media2.giphy.com/media/l1J9Llv1ztqa8cjZe/200w.webp?cid=ecf05e47tf115xsn89b7tcvplwlc8ynrs9timhyusa1hra1d&rid=200w.webp&ct=g'
    }
},{
    timestamps: true,
});
module.exports = mongoose.model('rooms', room);