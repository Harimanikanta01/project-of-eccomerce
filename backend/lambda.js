// lambda.js
const serverless = require('serverless-http');
const app = require('.');
const connectDB = require('./config/db');

let isDbConnected = false;

const handler = async (event, context) => {
    // Connect to DB only on cold start
    if (!isDbConnected) {
        await connectDB();
        isDbConnected = true;
        console.log("Connected to DB");
    }

    // Handle the Lambda event
    return serverless(app)(event, context);
};

module.exports.handler = handler;
