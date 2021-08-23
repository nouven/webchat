const mongoose = require('mongoose');

const url = "localhost:mongodb://localhost:27017/test_1";

async function connect(){
    try {
        await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connect successfully');
    } catch (error) {
        console.log(error);
    }
}
module.exports ={connect};
// const url = 'mongodb+srv://test:BDG1XrrQpLQjWo6m@cluster0.bclts.mongodb.net/testDB?retryWrites=true&w=majority';
//BDG1XrrQpLQjWo6m