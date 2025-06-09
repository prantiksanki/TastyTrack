const express = require('express');
const mongoose = require('mongoose');
const Order = require('./model/order');
const User = require('./model/user');
const Menu = require('./model/menu');
const Coupon = require('./model/coupon');
const Payment = require('./model/payment');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const Mongo_URI = process.env.MONGO_URL;
const app = express();
const PORT = process.env.PORT || 81; 

app.use(cors({
  origin: 'https://luckeys-kitchen-admin.onrender.com/', // Replace with your frontend origin
  credentials: true,
}));

mongoose.connect(Mongo_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the /public folder

// Login Endpoint
app.post('/login', (req, res) => {
  const emailForLogin = 'prantiksanki@gmail.com';
  const passwordForLogin = '12345';

  const { email, password } = req.body;

  if (email === emailForLogin && password === passwordForLogin) {
    res.json({ message: 'Login Successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get Today's Orders
app.get('/orders/today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching today\'s orders', error: err.message });
  }
});

// Get Orders by Date
app.get('/orders', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const orders = await Order.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Update Order Status
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
        updateFields.status = 'pending'; // Adjust based on your logic
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

// Get Customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await User.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
});

// Get New Orders
app.get('/orders/new', async (req, res) => {
  try {
    const since = new Date(req.query.since || Date.now() - 30 * 60 * 1000);
    const orders = await Order.find({ createdAt: { $gt: since } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching new orders', error: err.message });
  }
});

// Get Menu Items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu', error: err.message });
  }
});

// Create Menu Item
app.post('/menu', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.status(201).json({ message: 'Menu item created', item: newMenu });
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
});

// Update Menu Item by ID
app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
});

// Delete Menu Item by ID
app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
});

// Get All Coupons
app.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coupons', error: err.message });
  }
});

// Create Coupon
app.post('/coupons', async (req, res) => {
  try {
    console.log('Received coupon data:', req.body); // << debug

    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created', item: newCoupon });
  } catch (error) {
    console.error('Error creating coupon:', error); // << debug error here
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
});


// Update Coupon by ID
app.put('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon updated', item: updatedCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon', error: error.message });
  }
});

// Delete Coupon by ID
app.delete('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
});

// Create Payment
app.post('/payments', async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    console.log('Creating Payment:', newPayment);
    await newPayment.save();
    res.status(201).json({ message: 'Payment created', item: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
});


app.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find();
    const orders = await Order.find();

    orders.forEach(order => {
      payments.push({
        _id: order._id,
        customer: order.user,
        amount: order.total,
        status: order.isPaid ? "completed" : "pending",
        type: "credit",
        date: order.createdAt.toISOString().split('T')[0],
      });
    });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});



app.get("/customersDetails", async (req, res) => {
  try {
    const customers = await User.find();

    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer.email });
        // console.log(orders); // <== This will now work
        const totalOrders = orders.length;
        let totalSpent = 0 ; 
        orders.forEach(order => totalSpent += order.total); // <== This will now work

        let pendingAmount = 0 ; 
        orders.forEach(order => pendingAmount += order.isPaid === false ? order.total : 0); // <== This will now work

        return {
          name: customer.name,
          email: customer.email,
          phone: customer.phoneNo, // <== This will now work
          address: orders.length > 0 ? `${orders[0].selectedAddress.address}, ${orders[0].selectedAddress.city}`  : "", 
          totalOrders,
          totalSpent,
          pendingAmount,
        };
      })
    );

    res.json(customersWithOrders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching customers", error: err.message });
  }
});


app.get("/ordersall" , async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);

  }
  catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
  })




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});