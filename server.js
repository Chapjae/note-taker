const express = require('express');
const app = express();
const PORT = 3000;

//import relavent files needed
const path = require("path");
const notesDB = require("./db/db.json")
const fs = require("fs"); 

// setup and import middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// setup a route to get homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));

})

// setup a route to get notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
            JSON.parse(data);
        }
    })
})

// setup a post request so that a user can create a new note
app.post("/api/notes", (req, res) => {
const { title, text } = req.body;

 if (title && text) {
    const newNote = {
      title,
      text,
     };

     fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
        
            console.log(data);
            const parsedNote = JSON.parse(data);
            
            
            notesDB.push(newNote);
        }
     });

     fs.writeFile(
        "./db/db.json", 
        JSON.stringify(newNote), 
        (err) => {
            err 
            ? console.error(err) 
            : console.log("note added")
     });
    };  
});

app.listen(PORT, () => {
    console.log(`Port ${PORT} opened and running`)
})

