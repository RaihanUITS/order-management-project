const verify = require('../middleware/verify');
const isUser = require('../middleware/isUser');
const isAdmin = require('../middleware/isAdmin');
const isSuperAdmin = require('../middleware/isSuperAdmin');
const _ = require('lodash');
const axios = require('axios');
const { Product, validate } = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/*Generating product to local database by super-admin*/
router.post('/', [verify, isSuperAdmin], async (req, res) => {

    try {
        const val = await axios.get(process.env.product_url);
        for (value of val.data) {
            const { error } = validate(value);
            if (error) throw error;

            let product = await new Product(_.pick(value, ['title', 'price', 'description', 'category', 'image']));
            await product.save();

            res.send('Your products are loaded....');
            //console.log(_.pick(value, ['id', 'title']));
        }
    }
    catch (err) {
        return res.status(400).send(error.details[0].message);
    }

    // console.log(typeof res.data);
    // console.log(res.data[0]);

    // res.send(_.pick(product, ['name', 'quantity', 'isAvailable']));
});

/*Getting the products list by Users*/
router.get('/', [verify, isUser], async (req, res) => {
    try {
        const product = await Product.find().sort({ name: 1 });
        res.send(product);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;