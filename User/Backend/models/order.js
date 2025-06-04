const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  }, 

  cartItems: 
  {
    type: 
    [
      {
        name: 
        { 
            type: String, 
            required: true 
        },
        quantity: 
        { 
            type: Number, 
            required: true 
        },
        price: 
        { 
            type: Number, 
            required: true 
        }, 
        customization:
        {
            type: Object,
            default: {}
        }, 
        description:
        {
            type: String,
        }, 
        image:
        {
            type: String,

        }
      }
    ],
    required: true,
  },

  total: {
    type: Number,
    required: true,
  },

  paymentMethod: {
    type: String,
    required: true,
  }, 
  selectedAddress: 
  {
    type: Object,
    required: true,
  },
  promoCode:
  {
    type: String,
    default: null,
  }, 
  orderNote:
  {
    type: String,
    default: null,
  },
  isActive:
  {
    type: Boolean, 
    default: true, 
  }, 
  isPaid:
  {
    type: Boolean, 
    default : false, 
  }



});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;