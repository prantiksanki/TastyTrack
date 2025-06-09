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
// const dotenv = require('dotenv');


dotenv.config();

const mongodbURI = process.env.MONGO_URL;

const app = express() ; 
const port = process.env.PORT || 80;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


mongoose.connect(mongodbURI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))



app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
  console.log(req.body);


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
       const user = new User({ name, email, password : hashedPassword, phoneNo: phone });
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


app.post("/add-address", async (req, res) => {
  try {
    const { type, title, address, city, pincode, landmark, user } = req.body;

    // console.log(req.body);

    if (!type || !title || !address || !city || !pincode || !landmark || !user) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure pincode is a number
    const parsedPincode = parseInt(pincode.toString().replace(/[^\d]/g, ''), 10);
    if (isNaN(parsedPincode)) {
      return res.status(400).json({ error: "Pincode must be a valid number" });
    }


    const userExists = await User.findOne({email: user});
    if (!userExists) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const newAddress = new Address({
      type,
      title,
      address,
      city,
      pincode: parsedPincode,
      landmark,
      user
    });

    const saved = await newAddress.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add address" });
  }
});


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


app.get("/user/:email", async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  console.log(user);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/orders/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await Order.find({ user: user.email});
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Server error" });
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

