const mongoose = require("mongoose")
const User = require('./userModel')



const userProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"Users"
    },
    age: {
        type: String,
        default:0
    },


    occupation: {
        type: String,
        default:""
    },


    gender: {
        type: String,
        default:"female"
    
    },
    phonenumber:{
        type: String,
        default:""
    }
})

module.exports = mongoose.model('Userprofile',  userProfileSchema)