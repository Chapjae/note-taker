const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//import relavent files needed
const path = require("path");
const fs = require("fs");
const uuid = require("uuid"); 

// setup and import middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// setup a route to get homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// setup a route to get notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// get previously written notes
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));

    fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
            JSON.parse(data);
        };
    });
});

// setup a post request so that a user can create a new note
app.post("/api/notes", (req, res) => {
    const { title, text, id } = req.body;

    if (title && text) {
     const newNote = {
       title,
       text,
       id: uuid.v4()
      };


    //  readfile first because we have to push the new note to parsed note
     fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
        
            console.log(data);
            const parsedNote = JSON.parse(data); 
            parsedNote.push(newNote);
            
            fs.writeFile(
                "./db/db.json", JSON.stringify(parsedNote), 
                (err) => 
                err ? console.error(err) : console.log("note added")  
                );
            };
        });
    
        const response = {
            status: "success",
            body: newNote,

        };

        res.status(201).json(response)
        } else { 
        res.status(500).json("error");
    }
});

// if the user enters a route that doesn't exist, send them to the homepage
app.get("*", (req, res) =>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.listen(PORT, () => {
    console.log(`Port ${PORT} opened and running`)
})

