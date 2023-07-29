const express = require('express');
const app = express();
const PORT = 3000;

//import relavent files needed
const path = require("path")
const notesDb = require("./db/db.json");
const fs = require("fs"); 

// setup and import middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// setup a route to get homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));

})

// setup a route to get notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
    
    const getNotes = () => {

        fs.readFile("./db/db.json", notesDb, (err) => {
            console.log(notesDb);
        });
    };
})

// setup a post request so that a user can create a new note
app.post("/notes", (req, res) => {
 const { title, text, note_id } = req.body;

 if (title && text && note_id) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
     };
    
     const noteString = JSON.stringify(newNote);
     
     noteString = req.body 

     fs.writeFile("./db/db.json", noteString, (err) => {
       err ? console.error(err) 
       : req.body = noteString,
       console.log("note added")
     });
    };

});

app.listen(PORT, () => {
    console.log(`Port ${PORT} opened and running`)
})

