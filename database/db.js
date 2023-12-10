const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongodbUriBase64 = process.env.MONGODB_URL
const mongodbUri = Buffer.from(mongodbUriBase64, 'base64').toString('utf-8');
async function connect(){
   
    console.log("URL " + mongodbUri);
    mongoose.connect(mongodbUri)
        .then(() =>
        {console.log("Connected to MongoDB");}

        ).catch(() => 
        {console.log("Failed to connect to MongoDB");
        })
}   

module.exports = {connect}