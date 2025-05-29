const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
const User = require("./models/user") ; 


dotenv.config();

const app = express() ; 
const port = 80 ||  process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: true}))



mongoose.connect("mongodb://localhost:27017/tastytrack")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))



app.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;


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


app.get("/menu" , (req,res) =>
{
     const {id, name , description, price, time, rating, category , image, isPopular} = req.body ; 
     

})



if(!port)
  {
    console.log("Port not found") ; 
  }
app.listen(port, (req,res) =>
{
    console.log(`Server is running on port ${port}`)
})