const mongoose = require('mongoose');
require('dotenv').config();
const { Chat } = require('../models/chat');
const Payment = require('../models/payment');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in the .env file');
    }

    await mongoose.connect(MONGODB_URI);

    for (const model of [Chat, Payment]) {
        const collectionExists = await mongoose.connection.db
            .listCollections({ name: model.collection.name })
            .hasNext();

        if (!collectionExists) {
            await model.createCollection();
        }
    }
};



module.exports = connectDB;