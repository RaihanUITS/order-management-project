/*Checking if the user is Super-admin*/

function isSuperAdmin(req, res, next) {
    if (req.user.role != 'super-admin') return res.status(401).send('You are not authorized!!');

    next();
}

module.exports = isSuperAdmin;