const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    email: {
        type:String, 
        required:true,
        unique : true, 
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid!")
            }
        }
    },
    password: {
        type : String, 
        required : true
    }
},
{
    timestamps:true
})

//middleware to encrypt password
userSchema.pre('save',async function(next){
    const user = this
     if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
    next()
  }
})

module.exports = mongoose.model('User',userSchema);