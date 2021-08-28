const mongoose = require("mongoose");

// const url = "localhost:mongodb://localhost:27017/test_1";
const url ="mongodb+srv://test:BDG1XrrQpLQjWo6m@cluster0.bclts.mongodb.net/webchat_test?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected!");
  } catch (error) {
    console.log(error);
  }
}
module.exports = { connect };
//BDG1XrrQpLQjWo6m
