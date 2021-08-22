const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
    _id:  String, 
    product_id: String,
    status:   String,
});
module.exports = mongoose.model('orders', order);
