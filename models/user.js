const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose =  require('mongoose');
const Joi = require('joi');

/*Schema for the Users Collection*/
const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 5, 
        maxlength: 50
    }, 
    email: {
        type: String, 
        required: true, 
        unique: true, 
        minlength: 5, 
        maxlength: 255,
        index: true
    }, 
    password: {
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 1024
    }, 
    role: {
        type: String, 
        required: true, 
        enum: ['user', 'admin', 'super-admin']
    }
});

/*Generating JSON Web token for a user*/
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, role: this.role }, config.get('jwtPrivateKey'));
    return token;
}

/*Model of the users collection*/
const User = mongoose.model('Users', userSchema);

/*Validation of user*/
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(), 
        email: Joi.string().min(5).max(255).required().email(), 
        password: Joi.string().min(5).max(1024).required(), 
        role: Joi.string().lowercase().valid('user', 'admin', 'super-admin').required()
    };

    return Joi.validate(user, schema);
}

exports.validate = validateUser;
exports.User = User;