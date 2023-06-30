const express = require('express')
const path = require('path')
const fs = require('fs')
const { readAndAppend } = require('../../01-Activities/22-Stu_Modular-Routing/Unsolved/helpers/fsUtils')

const PORT = 3001
const app = express()

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

//GET route for homepage
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'));
})

//GET route for notes page
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'))
})

//POST route for new note
app.post('/notes',(req,res)=>{
    const {title,text} = req.body;

    if(req.body){
        const newNote = {
            title,
            text
        };
        readAndAppend(newNote,'./db/db.json');
        res.json('Note added successfully');
    }else{
        res.error('Error in adding note')
    }
});

app.listen(PORT,()=>
console.log(`App listening at http://localhost:${PORT}`))

