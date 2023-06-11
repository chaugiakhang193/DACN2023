const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Annoucement = new Schema({
    Type:{
        type:String,
        required:true, 
    },
    Title:{
        type:String,
        required:true,
        
    },
    Content:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    CreateAt:{
        type:String,
    },
    UpdateAt:{
        type:String,
    },
    DateCreateAt:{
        type:Date,
        default: Date.now
    },
    DateUpdateAt:{
        type:Date,
        default: Date.now
    },
    Public:{
        type: Boolean,
        default: false
    },
    Author:{
        type:String,
        default:'Unknown'
    }
   

})


module.exports = new mongoose.model('Annoucement', Annoucement);