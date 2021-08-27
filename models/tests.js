const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const list = new Schema({
    number_1: String,
    number_2: String,
});
const test = new Schema({
    name: String ,
    avatar: {
        type: String,
        default: 'http://images.fineartamerica.com/images-medium-large/alien-face-.jpg' 
    }   
},{
    timestamps:true
});

module.exports = mongoose.model('tests', test);