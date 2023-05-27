const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function connect(){
    mongoose.connect("mongodb://127.0.0.1:27017")
        .then(() =>
        {console.log("Connected to MongoDB");}

        ).catch(() => 
        {console.log("Failed to connect to MongoDB");
        })
}   

module.exports = {connect}