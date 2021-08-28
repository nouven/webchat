const mongoose = require("mongoose");

const url =
  "mongodb+srv://new_user:btKUdUEtgU3Nuvoy@cluster0.bclts.mongodb.net/webchat_test";
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
