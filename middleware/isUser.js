/*Checking if it's a user*/
function isUser(req, res, next) {
    if (req.user.role != 'user') return res.status(401).send('You are not authorized!!');

    next();
}

module.exports = isUser;