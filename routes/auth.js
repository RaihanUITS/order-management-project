const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/*Logging in the valid user*/
router.post('/', async (req, res) => {

    try {
        const { error } = validate(req.body);
        if (error) throw error;

        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invaild email or password.....');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invaild email or password.....');

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send('You are Logged in.....');
    }
    catch (err) {
        return res.status(400).send(err.details[0].message);
    }
    
});

/*Validating the provided information*/
function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
