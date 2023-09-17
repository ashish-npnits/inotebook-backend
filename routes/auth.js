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
], async (req, res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    console.log(req.body);
    try{
        let user = await User.find({email: req.body.email});
    if(user){
        res.status(400).json({error: 'Sorry user with this eamail already exist'})
    }
     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    }catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
    }
    
    
} )

module.exports = router