const mongoose = require("mongoose") ; 

const addressSchema = mongoose.Schema(
    {
        type:
        {
            type: String,
            required: true,
            enum: ['residential', 'commercial'], 
            default: 'residential',
        }, 
        title:
        {
            type: String,
            minlength: 3,
            maxlength: 50,
        }, 
        address:
        {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 255,
        }, 
        city:
        {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        }, 
        pincode:
        {
            type: Number,
            required: true,
            minlength: 6,
            maxlength: 6,
        }, 
        landmark:
        {
            type: String,
            minlength: 3,
            maxlength: 100,
        }, 
        isDefault:
        {
            type: Boolean,
            default: false,
        }, 
        user:
        {
            type : String, 
            required : true
        }
       
    }
)

const Address = mongoose.model("addresses", addressSchema) ;

module.exports = Address ;