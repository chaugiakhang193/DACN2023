const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Asset = new Schema({
    URL:{
        type:String,
    },
    Name:{
        type:String,
    },
    CloudinaryFolder:{
        type:String,
    },
    idOwner:{
        type:String,
    },
    Description:{
        type:String,
    },
    CreateAt:{
        type:String,
    },
    DateCreateAt:{
        type:Date,
        default: Date.now
    }
})


module.exports = new mongoose.model('Asset', Asset);