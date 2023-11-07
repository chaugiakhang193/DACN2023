const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({

    idAuthor:{
        type:String,
    },
    RealNameAuthor:{
        type:String,
    },
    idCourse:{
        type:String,
    },
    Content:{
        type:String,
    },
    CreateAt:{
        type:String,
    },
    DateCreateAt:{
        type:Date,
        default: Date.now
    },
    ReplyFor:{
        type:String,
    },

})


module.exports = new mongoose.model('Comment', Comment);