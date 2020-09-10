//npm package dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
//const resolve = require("path");
//const notesJSON = require("./db/db.json");

// const resolve = require("path") kept getting an error __dirname, made a variable to define __dirname
const Dir = path.join(__dirname, "/public");

//sets initial express app
const app = express();
const PORT = process.env.PORT || 3003;

//sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Route for index.js
app.get("/assets/js/index.js", function (req, res) {
  res.sendFile(path.join(Dir, "/assets/js/index.js"));
});

// Route for css
app.get("/assets/css/styles.css", function (req, res) {
  res.sendFile(path.join(Dir, "/assets/css/styles.css"));
});

//Note Array
const currentNote = fs.readFileSync(path.resolve(`${__dirname}/db/db.json`));
const notesArray = JSON.parse(currentNote);

//Function to set IDs for each individual note
const notesId = () => {
  for (let i = 0; i < notesArray.length; i++) {
    notesArray[i].id = i;
  }
}

//api route to show all notes
app.get("/api/notes", function (req, res) {
  return res.json(notesArray);
});

//creates a new note
app.post("/api/notes", function (req, res) {
  const newNote = req.body;
  notesArray.push(newNote);
  res.json(newNote);
  notesId();
  fs.writeFileSync(path.resolve(`${__dirname}/db/db.json`), JSON.stringify(notesArray), null, 2);
  res.json(newNote);
});

//deletes a note
app.delete("/api/notes/:id", function (req, res) {
  const deleteNote = req.params.id;
  notesArray.splice(deleteNote, 1);
  notesId();
  fs.writeFileSync(path.resolve(`${__dirname}/db/db.json`), JSON.stringify(notesArray), null, 2);
  res.json(notesArray);
});

//html routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(Dir, "notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(Dir, "index.html"));
});


app.listen(PORT, function () {
  console.log("App is listening on 'http://localhost:" + PORT);
}); 
