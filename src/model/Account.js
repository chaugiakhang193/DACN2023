const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    name:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:''
    },
    teacher:{
        type: Boolean,
        default: false
    },
    MSSV:{
        type:String,
        default:''
    },
    Realname:{
        type:String,
        default:''
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


module.exports = new mongoose.model('AccountSchema', AccountSchema);