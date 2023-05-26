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
    }
})


module.exports = new mongoose.model('AccountSchema', AccountSchema);