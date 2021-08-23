const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    name: String,
});
module.exports = mongoose.model('users', user);