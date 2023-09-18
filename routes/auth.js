const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'MYJSON@@WEB@@Secret';
router.get('/', (req, res)=>{
    obj = {
        a: 'thios',
        number: 34
    }
    res.json(obj)
} )

router.post('/createuser',[
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

    if(user.length>0){
        res.status(400).json({error: 'Sorry user with this eamail already exist'})
        return;
    }

    var salt = await bcrypt.genSaltSync(10);
    var hashPasswd = await bcrypt.hashSync(req.body.password, salt);

     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPasswd
    })

    var authtoken = jwt.sign({ id: user.id }, JWT_SECRET);

    res.status(200).json({success:true,authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).json("some error occured");
        return ;
    }
    
    
} )



router.post('/login',[
    body('email', 'Enter a valid name').isEmail(),
    body('password','Password cannot be blank').exists()
], async (req, res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, error: 'please try to login with correct credentials'});
        }
        console.log('user.password '+ user.password);
        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare)
            return res.status(400).json({success:false, error: 'please try to login with correct credentials'});


        var authtoken = jwt.sign({ id: user.id }, JWT_SECRET);
        res.status(200).json({success:true,authtoken});
    } catch (error) {
        return res.status(500).json({success:false, error: 'Internal server error'});
    }
})


router.get('/getuser',fetchuser, async (req, res)=>{
    try {
        const userId = req.userid;
        let user = await User.findById(userId).select('-password');
        res.status(200).json({success:true,user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, error: 'Internal server error'});
    }
    
})
module.exports = router