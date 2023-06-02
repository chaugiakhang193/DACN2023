const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function connect(){
    mongoose.connect(process.env.MONGODB_URL)
        .then(() =>
        {console.log("Connected to MongoDB");}

        ).catch(() => 
        {console.log("Failed to connect to MongoDB");
        })
}   

module.exports = {connect}