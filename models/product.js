const mongoose = require('mongoose');
const Joi = require('joi');

/*Schema of the Prodcut Collection*/
const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        minlength: 3, 
        maxlength: 1024,
        index: true
    }, 
    price: {
        type: Number, 
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'NO IMAGE'
    }
});

/*Model of the Product Collection*/
const Product = mongoose.model('Products', productSchema);

/*Validating a product*/
function validateProduct(product) {
    const schema = {
        title: Joi.string().min(3).max(1024).required(), 
        price: Joi.number().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        image: Joi.string().optional()
    };

    return Joi.validate(product, schema);
}

exports.validate = validateProduct;
exports.Product = Product;