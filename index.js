const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
app.use(express.static("dist"));

let notes = [
  {
    id: "1",
    content: "html is easy",
    important: true,
  },
  {
    id: "2",
    content: "browser can only execute Javascript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of the HTTP protocol",
    important: false,
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// Create a new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const newNote = {
    id: (notes.length + 1).toString(), // Generate a new ID
    content: body.content,
    important: body.important || false,
  };

  notes.push(newNote);
  response.json(newNote);
});

// Get a specific note by ID
app.get("/api/notes/:id", (request, response) => {
  const note = notes.find((note) => note.id === request.params.id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).send({ error: "note not found" });
  }
});

// Delete a specific note by ID
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
