const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userid });
    res.json(notes);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/createnotes',
  fetchuser,
  [
    body('title', 'Enter a valid name').isLength({ min: 5 }),
    body('description', 'Enter a valid name').isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }

      const { title, description, tag } = req.body;
      const savedNotes = await Note.create({ title, description, tag, user: req.userid });

      res.json(savedNotes);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put('/updatenotes/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Not Found');
    }
    console.log('note.user.toString ' + note.user.toString());
    console.log('req.userid ' + req.userid);
    if (note.user.toString() !== req.userid) {
      return res.status(401).send('Not Allowed');
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

    res.json(note);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send('Not Found');
    }
    console.log('note.user.toString ' + note.user.toString());
    console.log('req.userid ' + req.userid);
    if (note.user.toString() !== req.userid) {
      return res.status(401).send('Not Allowed');
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ success: 'note deleted', note });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
