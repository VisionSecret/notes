const mongoose = require("mongoose");

async function ConnectDB() {
  try {
    await mongoose.connect("mongodb+srv://notes:notes@cluster0.usjmz.mongodb.net/notesApp");
    console.log("Db Connected Successfully!");
  } catch (error) {
    throw new Error("error connected to DB", error);
  }
}

module.exports = ConnectDB;
