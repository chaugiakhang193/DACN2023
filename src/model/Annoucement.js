const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Annoucement = new Schema({
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
        type:Date,
        default: Date.now
    },
    UpdateAt:{
        type:Date,
        default: Date.now
    },
   

})


module.exports = new mongoose.model('Annoucement', Annoucement);