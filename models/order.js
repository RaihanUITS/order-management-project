const mongoose =  require('mongoose');
const Joi = require('joi');

/*Schema of order collection*/
const orderSchema =  new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        index: true
    }, 
    productName: {
        type: String,
        required: true, 
        minlength: 3, 
        maxlength: 50
    }, 
    quantity: {
        type: String, 
        required: true, 
    }, 
    status: {
        type: String,
        enum: ['accepted', 'delivered', 'pending'],
        default: 'pending'
    }, 
    date: {
        type: Date, 
        default: Date.now()
    }
});

/*Model of the orders collection*/
const Order = mongoose.model('Orders', orderSchema);

/*Validating a order*/
function validateOrder(order) {
    const schema = {
        userId: Joi.string().required(),
        productName: Joi.string().min(3).max(50).required(),
        quantity: Joi.string().required(),
        status: Joi.string().lowercase().valid('accepted', 'delivered', 'pending').optional()
    };

    return Joi.validate(order, schema);
}

/*Validating the Status*/
function inquireStatus(order) {
    const schema = {
        status: Joi.string().lowercase().valid('accepted', 'delivered', 'pending').required()
    }

    return Joi.validate(order, schema);
}

exports.inquire = inquireStatus;
exports.validate = validateOrder;
exports.Order = Order;