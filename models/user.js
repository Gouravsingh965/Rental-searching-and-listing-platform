const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{type:String,
        required:true
    },
    username:String
    
});
userSchema.plugin(passportLocalMongoose); //usernaem + pass + hashing + salting
module.exports=mongoose.model("User",userSchema);