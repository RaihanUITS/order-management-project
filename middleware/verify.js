const jwt = require('jsonwebtoken');
const config = require('config');

/*Verifying the JSON web token*/
function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const info = jwt.verify(token, config.get('jwtPrivateKey'));
        //console.log(decoded);
        req.user = info;
        next();
    }
    catch(ex) {
        res.status(400).send('Invalid token provided!');
    }
}

module.exports =  auth;