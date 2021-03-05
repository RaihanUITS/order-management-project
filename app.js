const dotenv = require('dotenv');
dotenv.config();

const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const users = require('./routes/users');
const auth =  require('./routes/auth');
const orders =  require('./routes/orders');
const products = require('./routes/products');

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/orders', orders);
app.use('/api/products', products);


/*Configuring the private key*/
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
}

/*Connecting to the order-management database */

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            autoIndex: false
        });
        
        console.log('Connected to MongoDB....');

    } catch (err) {
        console.error('Could not connect to MongoDB....');
    }
};

connectDB();

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));

