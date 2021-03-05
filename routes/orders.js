const verify = require('../middleware/verify');
const isUser = require('../middleware/isUser');
const isAdmin = require('../middleware/isAdmin');
const isSuperAdmin = require('../middleware/isSuperAdmin');
const _ = require('lodash');
const { Order, validate, inquire } = require('../models/order');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/*Placing an order by the user*/
router.post('/', [verify, isUser], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) throw error;

        let order = await new Order(_.pick(req.body, ['userId', 'productName', 'quantity', 'status']));
        await order.save();

        res.send(_.pick(order, ['userId', 'productName', 'quantity']));
    }
    catch (err) {
        return res.status(400).send(error.details[0].message);
    }
});

/*Changing status of the order by Admin*/
router.put('/:id', [verify, isAdmin], async (req, res) => {
    try {
        const { error } = inquire(req.body);
        if (error) throw error;

        const order = await Order.findByIdAndUpdate(req.params.id,
            { status: req.body.status },
            { new: true })
            .catch(err => {
                return res.status(404).send('The order with the given ID was not found.');
            });

        //if (!order) return res.status(404).send('The user with the given ID was not found.');

        res.send(_.pick(order, ['status', 'userId', 'productName', 'quantity']));
    }
    catch (err) {
        return res.status(400).send(error.details[0].message);
    }
});

/*Getting all the orders by the Super-admin*/
router.get('/', [verify, isSuperAdmin], async (req, res) => {
    try {
        const order = await Order.find().sort({ date: 1 });
        res.send(order);
    }
    catch (err) {
        return res.status(400).send(err);
    }
});

module.exports = router;
