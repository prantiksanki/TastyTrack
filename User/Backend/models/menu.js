const mongoose = require("mongoose") ; 

const menuSchema = mongoose.Schema(
    {
       name:
       {
          type: String,
          required: true,
       }, 
       description :
       {
        type: String, 
       }, 
       price:
       {
        type: Number,
        required: true,
        min: 0
       },
       image:
       {
        type: String,
        required: true

       }, 
       customizations:
       {
         type: Array,
       }, 
       time:
       {
        type: String,
        required: true,
        enum: ["15-20 min", "30-45 min", "60-90 min"], 
        default: "30-45 min", 
       },
       rating:
       {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 4.5,
       }, 
       category:
       {
        type: String,
        required: true,
        enum: ["Starters", "Main Course", "Dessert", "Beverages"],
        default: "Main Course",
       }
    }, 
    { timestamps: true }
)

const Menu = mongoose.model("menu", menuSchema) ;

module.exports = Menu ;