var express = require("express");
const notesModel = require("../Model/notes.model");
var router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, function (req, res, next) {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  res.render("index");
});

router.get("/notes", authMiddleware, async function (req, res, next) {
  if (!req.user) {
    return res.redirect("/auth/login");
  }

  try {
    const allNotes = await notesModel.find();
    if (allNotes.length <= 0) {
      const error = new Error("Note not found!");
      error.statusCode = 404;
      return next(error); // send to error middleware
    }

    res.render("home", { notes: allNotes, user: req.user });
  } catch (err) {
    next(err);
  }
});

router.post("/create", async function (req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title) {
      const error = new Error("Title must be required!");
      error.statusCode = 404;
      return next(error); // send to error middleware
    }
    const notes = await notesModel.create({
      title,
      content,
    });

    res.status(200).json({ message: "Note created successfully", data: notes });
  } catch (err) {
    next(err);
  }
});

router.get("/notes/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const note = await notesModel.findOne({ _id: id });

    if (!note) {
      const error = new Error("Note not found!");
      error.statusCode = 404;
      return next(error); // send to error middleware
    }

    res.status(200).json({ message: "Note fetched successfully", data: note });
  } catch (err) {
    next(err);
  }
});

router.put("/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedNote = await notesModel.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      const error = new Error("Note not found!");
      error.statusCode = 404;
      return next(error);
    } // send to error middleware

    res.status(200).json({
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/notes/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    const existingNote = await notesModel.findOneAndDelete({ _id: id });

    if (!existingNote) {
      const error = new Error("Note not found!");
      error.statusCode = 404;
      return next(error);
    } // send to error middleware

    res
      .status(200)
      .json({ message: "Note deleted successfully", data: existingNote });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
