const jwt = require('jsonwebtoken');
require('dotenv').config();


function auth(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied !!!!');
    try {
        const verified = jwt.verify(token,process.env.SECRET_KEY);
        const payload = jwt.decode(token,process.env.SECRET_KEY);
        req.user = payload;
        next();
    }catch(err){
        console.log(err)
        res.status(400).send('Invalid Token !!!!');
    }
}

module.exports = auth