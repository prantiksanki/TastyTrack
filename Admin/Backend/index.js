const express = require('express');
const mongoose = require("mongoose"); 
const Order = require("./model/order");
const cors = require('cors');
const User = require("./model/user");

const app = express();
const PORT = 81 ; 

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend origin
  credentials: true
}));

mongoose.connect("mongodb://localhost:27017/tastytrack")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err))




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the /public folder




app.post('/login', (req, res) => {

    const emailForLogin = "prantiksanki@gmail.com"
    const passwordForLogin = "12345"; 

    const {email, password} = req.body; 

    if(email === emailForLogin && password === passwordForLogin)
    {
        res.json({message: "Login Successful"});
    }
    else
    {
        res.status(401).json({message: "Invalid credentials"});
    }
    
})


app.get('/orders/today', async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching today's orders", error: err });
  }
});





app.get('/orders', async (req, res) => {   // /orders?date=2025-06-05
  try {
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});




app.patch('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { isActive, isPaid } = req.body;

    // Convert string 'true'/'false' to boolean if needed
    if (typeof isActive === 'string') isActive = isActive === 'true';
    if (typeof isPaid === 'string') isPaid = isPaid === 'true';

    const updateFields = {};

    // Apply individual field updates only if explicitly provided
    if (typeof isActive === 'boolean') updateFields.isActive = isActive;
    if (typeof isPaid === 'boolean') updateFields.isPaid = isPaid;

    // Handle status logic
    if (typeof isActive === 'boolean' && typeof isPaid === 'boolean') {
      if (isActive && !isPaid) {
        updateFields.status = 'pending';
      } else if (isActive && isPaid) {
        updateFields.status = 'pending'; // can be 'pending' if your logic says so
      } else if (!isActive && isPaid) {
        updateFields.status = 'delivered';
      }
    }

    console.log('Updating Order:', { id, updateFields });

    const order = await Order.findByIdAndUpdate(id, updateFields, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});



// Backend: Example endpoint for customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await User.find(); // Assuming a Customer model
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err });
  }
});


app.get('/orders/new', async (req, res) => {
  try {
    const since = new Date(req.query.since || Date.now() - 30 * 60 * 1000);
    const orders = await Order.find({ createdAt: { $gt: since } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching new orders', error: err });
  }
});






app.listen(PORT, (req,res) =>
{
    console.log(`Server is running on port ${PORT}`);
})