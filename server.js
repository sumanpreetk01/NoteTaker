const express = require('express')
const path = require('path')
const fs = require('fs/promises')
const uuid = require('./helpers/uuid')
const PORT = process.env.PORT || 3001
const app = express()

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

//GET route for homepage
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'));
})

//GET route for notes page
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/notes.html'))
})

//Read notes
const readNotes = async () => {
    try {
        var data = await fs.readFile("./db/db.json", "utf-8")
        var parsedData = JSON.parse(data)
        return parsedData     
    } catch (error) {
        console.log(error)
        return "Couldn't read notes!"
    }
}

//Write notes
const writeNotes = async (newNotes) => {
    try {
        await fs.writeFile("./db/db.json", JSON.stringify(newNotes))
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

// GET route for Notes data
app.get("/api/notes", async (req,res)=> {
    const notes = await readNotes()
    res.json(notes)
})

//POST route for new note
app.post('/api/notes',async (req,res)=>{    
    if(req.body){
        const {title,text} = req.body;
        const newNote = {
            title,
            text,
            id: uuid()
        };
        var currentNotes = await readNotes()
        currentNotes.push(newNote)
        var successfulWrite = await writeNotes(currentNotes)
        if(successfulWrite){
            return res.json('Note added successfully');
        }
        return res.json("Error in adding note")
    }else{
        res.json('Error in adding note')
    }
});

//DELETE route to delete note
app.delete('/api/notes/:id',async (req,res)=>{
    const noteID = req.params.id
    var currentNotes = await readNotes()
    var newNotesArr = currentNotes.filter(note => note.id !==noteID)

    var successfulWrite = await writeNotes(newNotesArr)
    if(successfulWrite){
        return res.json('Note deleted successfully');
    }
    return res.json('Error in deleting note')
})

app.listen(PORT,()=>
console.log(`App listening at http://localhost:${PORT}`))


readNotes()