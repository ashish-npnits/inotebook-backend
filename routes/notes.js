const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes',fetchuser, async (req, res)=>{
    const notes = await Note.find({user: req.userid});
    res.json(notes)
} )

router.post('/createnotes',fetchuser,[
    body('title', 'Enter a valid name').isLength({min: 5}),
    body('description', 'Enter a valid name').isLength({min: 5}),
], async (req, res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const {title, description, tag} = req.body;
    const savedNotes = await Note.create({title,description,tag, user:req.userid})
    
    res.json(savedNotes);
} )

module.exports = router