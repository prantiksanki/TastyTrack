// id: 1,
//             name: 'Butter Chicken',
//             description: 'Creamy tomato-based curry with tender chicken',
//             price: 320,
//             quantity: 2,
//             image: '🍛',
//             customizations: ['Extra Spicy', 'No Onions']




const mongoose = require("mongoose") ; 


const cartSchema = mongoose.Schema(
    {
        user:
        {
            type: String,
            required: true
        }, 
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
       quantity:
       {
        type: Number,
        required: true,
        min: 0
       } ,
       image:
       {
        type: String,
        required: true

       }, 
       customizations:
       {
         type: Array,
       }
    }, 
    { timestamps: true  }
)

const Cart = mongoose.model("cart", cartSchema) ;

module.exports = Cart ;