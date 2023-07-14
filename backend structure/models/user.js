const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Image = require("./image")
const UserSchema = new mongoose.Schema({
    email : {
        type : String , 
        required : true
    },
    role : {
        type : String,
        default : "user"
    },
    images : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : Image
    }]
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User" , UserSchema);
