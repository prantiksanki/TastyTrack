const mongoose = require("mongoose") ; 

const userSchema = mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true,
        }, 
        email :
        {
            type : String, 
            required : true, 
            unique : true
        },
        phoneNo:
        {
            type: String,
            required: true,
            unique: true,
            minlength: 10,
            maxlength: 15,
        }, 
        password:
        {
            type : String, 
            required : true , 
        }
    }
)

const User = mongoose.model("user", userSchema) ;

module.exports = User ;