const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const User = require("./models/user") ; 
const Menu = require("./models/menu") ; 
const Address = require("./models/address") ; 
const Cart = require("./models/cart") ; 
const Order = require("./models/order") ; 
const Coupon = require("./models/coupon") ; 


dotenv.config();

const app = express() ; 
const port = 80 ||  process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend origin
  credentials: true
}));


mongoose.connect("mongodb://localhost:27017/tastytrack")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))



app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phone } = req.body;


  if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password and Confirm Password do not match" });
  }

  try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "Email is already registered" });
      }

    //   const transporter = nodemailer.createTransport({
    //       service: 'gmail',
    //       auth: {
    //           user: process.env.EMAIL,
    //           pass: process.env.PASSWORD,
    //       }
    //   });

    // const mailOptions = {
    //     from: 'imaginationbookpvtltd@gmail.com',
    //     to: email,
    //     subject: '🎉 Welcome to Imagination Book – Let Your Story Come to Life',
    //     html: ` WRITE HTML EMAIL HERE  `
    //   };
      
    //   const result = await transporter.sendMail(mailOptions);
      
      // console.log(result) ;
       // Create and save new user

       const name = firstName + " " + lastName;
       const saltRounds = 8 ;
       const hashedPassword = await bcrypt.hash(password, saltRounds);
       const user = new User({ name, email, password : hashedPassword });
       await user.save();

      return res.status(200).json({ message: 'Signup successful, email sent' });

  } catch (err) {
      console.error("Signup error:", err);
      if (err.code === 11000) {
          return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "Server error during signup" });
  }
});


app.post('/login' , async (req,res)=>
{
    console.log("Login page") ; 
    const {email, password} = req.body ; 
    const user = await User.findOne({email}) ;
    console.log(user) ; 
    if(!user)
    {
        return res.status(400).json({error : "User not found"})
    }
    else
    {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) 
      {
        return res.status(400).json({ error: "Invalid password" });
      } 
      else 
      {
        return res.status(200).json({ message: "Login successful" });
      }
    }
    
})


app.get("/menu", (req, res) => {
  Menu.find()
    .then(menu => res.json(menu))
    .catch(err => res.status(500).json({ error: "Failed to fetch menu" }));
});


app.post("/add-address" , (req,res) =>
{
  const {type, title, address, city, pincode, landmark, isDefault, user} = req.body ; 
  if(!type ||!title ||!address ||!city ||!pincode ||!landmark || !user)
  {
    return res.status(400).json({error : "All fields are required"}) ;
  }
  const userExists = User.findById(user) ;
  if(!userExists)
  {
    return res.status(400).json({error : "User does not exist"}) ;  // Check if user exists before creating new address
  }

  const newAddress = Address.create(
    {
      type,
      title,
      address,
      city,
      pincode,
      landmark,
      isDefault, 
      user, 
    }
  )
  newAddress.save()
 .then(address => res.json(address))
 .catch(err =>
   res.status(500).json({ error: "Failed to add address" })
  )
}
)

// GET /address?user=prantiksanki@gmail.com
app.get("/address", async (req, res) => {
  const user = req.query.user;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  try {
    const addresses = await Address.find({ user });
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});


//             id: 1,
//             name: 'Butter Chicken',
//             description: 'Creamy tomato-based curry with tender chicken',
//             price: 320,
//             quantity: 2,
//             image: '🍛',
//             customizations: ['Extra Spicy', 'No Onions']

app.post("/cart" , async (req,res) =>
{
  const {id, name, description , price, image , customizations, user} = req.body ; 

  let quantity = 1 ; 

  const cartSave  = await Cart.create(
    {
      id,
      name,
      description,
      price,
      image,
      customizations,
      quantity,
      user,
    }
  )
  cartSave.save()
  .then(cart => res.json(cart))
  .catch(err =>
    res.status(500).json({ error: "Failed to add to cart" })
  )


})


app.get("/cart", async (req, res) => {

  const user  = req.query.user;
  try 
  {
    const cart = await Cart.find({user: user}); 
    res.json(cart) ;
  }
  catch(err)
  {
    res.status(500).json({ error: "Failed to get cart" })
  }
})

app.post("/order" , async (req,res) =>
{
  const {selectedAddress , cartItems, orderNote, promoCode , paymentMethod , total, user} = req.body ; 
  if(!selectedAddress ||!cartItems ||!paymentMethod ||!total)
  {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const order = await Order.create({
    selectedAddress ,
    cartItems ,
    orderNote ,
    promoCode ,
    paymentMethod ,
    total,
    user,
  })
  order.save()
  .then(order =>
    res.json(order))
    .catch(err =>
      res.status(500).json({ error: "Failed to place order" })
    )

    // Clear cart after successful order
    Cart.deleteMany({ user: user})
    .catch(err => console.log(err))
    .then(() => console.log("Cart cleared successfully"))
    .finally(() => console.log("Server is running on port 80"))

})



app.get('/coupons', async (req, res) => {
  try {
   const coupons = await Coupon.find();
   res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
});



if(!port)
  {
    console.log("Port not found") ; 
  }
app.listen(port, (req,res) =>
{
    console.log(`Server is running on port ${port}`)
})

