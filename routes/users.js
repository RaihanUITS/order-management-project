const verify = require('../middleware/verify');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/*Getting the current user*/
router.get('/me', verify, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select('-password');
        res.send(user);
    }
    catch (err) {
        return res.status(400).send(err);
    }
});

/*Registering a new user*/
router.post('/', async (req, res) => {

    try {
        const { error } = validate(req.body);
        if (error) throw error;

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('This email is already registered.');

        user = new User(_.pick(req.body, ['name', 'email', 'password', 'role']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err) {
        return res.status(400).send(err.details[0].message);
    }

});

module.exports = router;
