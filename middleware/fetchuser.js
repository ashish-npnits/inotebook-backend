var jwt = require('jsonwebtoken');
const JWT_SECRET = 'MYJSON@@WEB@@Secret';

const fetchuser =(req, res, next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: 'please authenticate using a valid token'});
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        console.log(data);
        req.userid = data.id;
        next();
    } catch (error) {
        return res.status(401).send({error: 'please authenticate using a valid token'});
    }
}

module.exports = fetchuser