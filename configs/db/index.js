const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(process.env.mongo_url, {
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
