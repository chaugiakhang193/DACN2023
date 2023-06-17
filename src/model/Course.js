const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
    Name:{
        type:String,
        required:true, 
    },
    codeCourse:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },



    StartAt:{
        type:String,
    },
    EndAt:{
        type:String,
    },
    DateStartAt:{
        type:Date,
        
    },
    DateEndAt:{
        type:Date,
       
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



    idStudent:{
        type:String,
        
        
    },
    idTeacher:{
        type:String,
        
    },
    idAuthor:{
        type:String,
        required:true
    },
})


module.exports = new mongoose.model('Course', Course);