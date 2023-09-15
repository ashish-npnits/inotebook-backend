const express = require('express');
const router = express.Router();
const User = require('../models/User')

router.get('/', (req, res)=>{
    obj = {
        a: 'thios',
        number: 34
    }
    res.json(obj)
} )

router.post('/', (req, res)=>{
    console.log(req.body);
    const user = User(req.body);
    user.save();
    res.json(req.body)
} )

module.exports = router