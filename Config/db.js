const mongoose = require("mongoose");

async function ConnectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/notesApp");
    console.log("Db Connected Successfully!");
  } catch (error) {
    throw new Error("error connected to DB", error);
  }
}

module.exports = ConnectDB;
