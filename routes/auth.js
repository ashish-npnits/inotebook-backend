const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

router.get('/', (req, res)=>{
    obj = {
        a: 'thios',
        number: 34
    }
    res.json(obj)
} )

router.post('/',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid name').isEmail(),
    body('password').isLength({min: 5})
], (req, res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    console.log(req.body);
    const user = User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(
        user => res.json(user)
    ).catch(
        err => res.json({error: 'Please enter uniques value for the email', message: err.message})
    )
    
} )

module.exports = router