import React, { useState, useEffect } from 'react';
import {
  Bell,
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  Menu as MenuIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  Clock,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Gift,
  BarChart3,
  Settings,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const RestaurantAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch today's orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:81/orders/today');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
        setNewOrderCount(data.length);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Simulate new order notifications (replace with API call if available)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setNewOrderCount((prev) => prev + 1);
      }
      // Optional: Fetch new orders from a hypothetical endpoint
      
      const fetchNewOrders = async () => {
        try {
          const response = await fetch('http://localhost:81/orders/new');
          const newOrders = await response.json();
          setOrders((prev) => [...newOrders]);
          // setOrders((prev) => [...prev, ...newOrders]);

          setNewOrderCount((prev) => prev + newOrders.length);
        } catch (err) {
          console.error('Error fetching new orders:', err);
        }
      };
      fetchNewOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
  );

  const todayTotal = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.isActive);
  const deliveredOrders = orders.filter((order) => !order.isActive);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:81/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus === 'pending' }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, isActive: newStatus === 'pending' } : order
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating order status:', err);
    }
  };



  const togglePaymentStatus = async (orderId) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      const response = await fetch(`http://localhost:81/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: !order.isPaid }),
      });
      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, isPaid: !order.isPaid } : order
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating payment status:', err);
    }
  };

  const toggleItemAvailability = (itemId) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const addOrUpdateItem = (itemData) => {
    if (editingItem) {
      setMenuItems(
        menuItems.map((item) => (item.id === editingItem.id ? { ...item, ...itemData } : item))
      );
    } else {
      const newItem = { ...itemData, id: Date.now() };
      setMenuItems([...menuItems, newItem]);
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const deleteItem = (itemId) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };

  const addOrUpdateCoupon = (couponData) => {
    if (editingCoupon) {
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === editingCoupon.id ? { ...coupon, ...couponData } : coupon
        )
      );
    } else {
      const newCoupon = { ...couponData, id: Date.now() };
      setCoupons([...coupons, newCoupon]);
    }
    setShowCouponModal(false);
    setEditingCoupon(null);
  };

  const deleteCoupon = (couponId) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
  };

  const addPayment = (paymentData) => {
    const newPayment = { ...paymentData, id: Date.now(), date: new Date().toISOString() };
    setPayments([...payments, newPayment]);
    setShowPaymentModal(false);
  };

  // Hardcoded data (replace with API calls if available)
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Margherita Pizza', price: 299, category: 'Pizza', available: true },
    { id: 2, name: 'Chicken Biryani', price: 249, category: 'Biryani', available: true },
    { id: 3, name: 'Garlic Bread', price: 99, category: 'Sides', available: false },
    { id: 4, name: 'Raita', price: 49, category: 'Sides', available: true },
  ]);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      address: '123 Main St, City',
      totalOrders: 15,
      pendingAmount: 0,
      totalSpent: 4500,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 87654 32109',
      address: '456 Oak Ave, City',
      totalOrders: 8,
      pendingAmount: 298,
      totalSpent: 2100,
    },
    {
      id: 3,
      name: 'Kumkum',
      email: 'kumkum@gmail.com',
      phone: '+91 98765 43211',
      address: 'Ghatal, West Bengal, India',
      totalOrders: 1,
      pendingAmount: 711,
      totalSpent: 711,
    },
  ]);

  const [coupons, setCoupons] = useState([
    { id: 1, code: 'SAVE20', discount: 20, type: 'percentage', active: true, minOrder: 200 },
    { id: 2, code: 'FLAT50', discount: 50, type: 'fixed', active: true, minOrder: 300 },
    { id: 3, code: 'NEWUSER', discount: 10, type: 'percentage', active: true, minOrder: 500 },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      customer: 'john@example.com',
      amount: 697,
      date: new Date().toISOString(),
      type: 'credit',
      status: 'completed',
    },
    {
      id: 2,
      customer: 'jane@example.com',
      amount: -298,
      date: new Date().toISOString(),
      type: 'debit',
      status: 'pending',
    },
  ]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabButton = ({ id, icon: Icon, label, badge }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors relative ${
        activeTab === id ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
      aria-current={activeTab === id ? 'page' : undefined}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {badge > 0 && (
        <span className="absolute px-2 py-1 text-xs bg-yellow-400 rounded-full -top-2 -right-2">
          {badge}
        </span>
      )}
    </button>
  );

  const OrderCard = ({ order }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800">Order ID: {order._id}</h3>
          <p className="text-sm text-gray-600">{order.user}</p>
          <p className="text-sm text-gray-500">{order.selectedAddress?.address}</p>
          <p className="text-sm text-gray-500">{order.selectedAddress?.pincode}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-red-500">₹{order.total}</p>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              order.isActive ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {order.isActive ? 'Pending' : 'Delivered'}
          </span>
        </div>
      </div>

      <div className="mb-3 space-y-2">
        {order.cartItems.map((item, idx) => (
          <div key={idx} className="flex justify-between pb-1 text-sm border-b">
            <p>
              {item.name} x{item.quantity}
            </p>
            <p>₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      {order.orderNote && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> {order.orderNote}
          </p>
        </div>
      )}
      {order.promoCode && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <strong>Promo Code:</strong> {order.promoCode}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setShowOrderModal(true);
          }}
          className="flex-1 px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          aria-label={`View details for order ${order._id}`}
        >
          View Details
        </button>

        {order.isActive && (
          <button
            onClick={() => updateOrderStatus(order._id, 'delivered')}
            className="flex-1 px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
            aria-label={`Mark order ${order._id} as delivered`}
          >
            Mark Delivered
          </button>
        )}

        <button
          onClick={() => togglePaymentStatus(order._id)}
          className={`px-3 py-2 rounded text-sm ${
            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          aria-label={`Toggle payment status for order ${order._id}`}
        >
          {order.isPaid ? 'Paid' : 'Unpaid'}
        </button>
      </div>
    </div>
  );

  const CouponModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
          <button
            onClick={() => {
              setShowCouponModal(false);
              setEditingCoupon(null);
            }}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close coupon modal"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addOrUpdateCoupon({
              code: formData.get('code'),
              discount: parseInt(formData.get('discount')),
              type: formData.get('type'),
              minOrder: parseInt(formData.get('minOrder')),
              active: formData.get('active') === 'on',
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="coupon-code">
                Coupon Code
              </label>
              <input
                id="coupon-code"
                name="code"
                type="text"
                defaultValue={editingCoupon?.code || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="coupon-discount">
                Discount
              </label>
              <input
                id="coupon-discount"
                name="discount"
                type="number"
                defaultValue={editingCoupon?.discount || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="coupon-type">
                Type
              </label>
              <select
                id="coupon-type"
                name="type"
                defaultValue={editingCoupon?.type || 'percentage'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="coupon-minOrder">
                Minimum Order
              </label>
              <input
                id="coupon-minOrder"
                name="minOrder"
                type="number"
                defaultValue={editingCoupon?.minOrder || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="coupon-active"
                name="active"
                type="checkbox"
                defaultChecked={editingCoupon?.active || true}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium" htmlFor="coupon-active">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowCouponModal(false);
                setEditingCoupon(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Cancel coupon changes"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              aria-label="Save coupon"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Payment Entry</h2>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close payment modal"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addPayment({
              customer: formData.get('customer'),
              amount:
                parseFloat(formData.get('amount')) * (formData.get('type') === 'debit' ? -1 : 1),
              type: formData.get('type'),
              status: formData.get('status'),
              notes: formData.get('notes'),
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="payment-customer">
                Customer
              </label>
              <input
                id="payment-customer"
                name="customer"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="payment-amount">
                Amount
              </label>
              <input
                id="payment-amount"
                name="amount"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="payment-type">
                Type
              </label>
              <select
                id="payment-type"
                name="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="credit">Credit (Received)</option>
                <option value="debit">Debit (Given)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="payment-status">
                Status
              </label>
              <select
                id="payment-status"
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="payment-notes">
                Notes
              </label>
              <textarea
                id="payment-notes"
                name="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Cancel payment entry"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              aria-label="Add payment entry"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-lg">
                <MenuIcon className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setNewOrderCount(0)}
                className="relative p-2 text-gray-600 hover:text-red-500"
                aria-label="View notifications"
              >
                <Bell size={24} />
                {newOrderCount > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                    {newOrderCount}
                  </span>
                )}
              </button>
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {error && (
          <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
            <AlertCircle className="inline-block mr-2" size={20} />
            {error}
          </div>
        )}
        {isLoading && (
          <div className="p-4 text-center text-gray-600">Loading orders...</div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 p-4 bg-white rounded-lg shadow-sm">
            <nav className="space-y-2">
              <TabButton id="dashboard" icon={BarChart3} label="Dashboard" />
              <TabButton id="orders" icon={ShoppingCart} label="Orders" badge={pendingOrders.length} />
              <TabButton id="menu" icon={MenuIcon} label="Menu Items" />
              <TabButton id="customers" icon={Users} label="Customers" />
              <TabButton id="payments" icon={CreditCard} label="Payments" />
              <TabButton id="coupons" icon={Gift} label="Coupons" />
              <TabButton id="reports" icon={Calendar} label="Reports" />
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Today's Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <ShoppingCart className="text-red-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Orders</p>
                        <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                        <Clock className="text-yellow-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">{deliveredOrders.length}</p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                        <Check className="text-green-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Today's Sales</p>
                        <p className="text-2xl font-bold text-green-600">₹{todayTotal}</p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                        <DollarSign className="text-green-500" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {todayOrders.slice(0, 6).map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Orders Management</h2>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                      aria-label={`View ${pendingOrders.length} pending orders`}
                    >
                      Pending ({pendingOrders.length})
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                      aria-label={`View ${deliveredOrders.length} delivered orders`}
                    >
                      Delivered ({deliveredOrders.length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Menu Items</h2>
                  <button
                    onClick={() => setShowItemModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    aria-label="Add new menu item"
                  >
                    <Plus size={20} />
                    Add Item
                  </button>
                </div>

                <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {menuItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{item.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleItemAvailability(item.id)}
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                              aria-label={`Toggle availability for ${item.name}`}
                            >
                              {item.available ? 'Available' : 'Unavailable'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setShowItemModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                aria-label={`Edit ${item.name}`}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                                aria-label={`Delete ${item.name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Customers</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search customers"
                    />
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                      aria-label="Search"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="p-6 bg-white rounded-lg shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{customer.name}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              {customer.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              {customer.address}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`View details for ${customer.name}`}
                        >
                          <Eye size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Orders</p>
                          <p className="font-semibold">{customer.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Spent</p>
                          <p className="font-semibold">₹{customer.totalSpent}</p>
                        </div>
                      </div>

                      {customer.pendingAmount > 0 && (
                        <div className="p-3 mt-4 rounded-lg bg-red-50">
                          <p className="text-sm text-red-800">
                            Pending Payment: ₹{customer.pendingAmount}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Payment Management</h2>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    aria-label="Add new payment entry"
                  >
                    <Plus size={20} />
                    Add Entry
                  </button>
                </div>

                {/* Payment Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Receivables</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{payments.filter((p) => p.amount > 0).reduce((sum, p) => sum + p.amount, 0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                        <CheckCircle className="text-green-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Payables</p>
                        <p className="text-2xl font-bold text-red-600">
                          ₹{Math.abs(payments.filter((p) => p.amount < 0).reduce((sum, p) => sum + p.amount, 0))}
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <XCircle className="text-red-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Net Balance</p>
                        <p
                          className={`text-2xl font-bold ${
                            payments.reduce((sum, p) => sum + p.amount, 0) >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                        <CreditCard className="text-blue-500" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Entries */}
                <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium ${
                                payment.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              ₹{Math.abs(payment.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.type === 'credit'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {payment.type === 'credit' ? 'Received' : 'Given'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Coupons Management</h2>
                  <button
                    onClick={() => setShowCouponModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    aria-label="Add new coupon"
                  >
                    <Plus size={20} />
                    Add Coupon
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="p-6 bg-white border-l-4 border-yellow-400 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-yellow-600">{coupon.code}</h3>
                          <p className="text-sm text-gray-600">
                            {coupon.type === 'percentage'
                              ? `${coupon.discount}% OFF`
                              : `₹${coupon.discount} OFF`}
                          </p>
                          <p className="text-sm text-gray-500">Min order: ₹{coupon.minOrder}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setShowCouponModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label={`Edit coupon ${coupon.code}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteCoupon(coupon.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Delete coupon ${coupon.code}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            coupon.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => {
                            setCoupons(
                              coupons.map((c) =>
                                c.id === coupon.id ? { ...c, active: !c.active } : c
                              )
                            );
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                          aria-label={`Toggle status for coupon ${coupon.code}`}
                        >
                          Toggle Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Reports & Analytics</h2>

                {/* Monthly Report */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Monthly Report</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="p-4 text-center rounded-lg bg-red-50">
                      <p className="text-2xl font-bold text-red-600">{orders.length}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="p-4 text-center rounded-lg bg-green-50">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{orders.reduce((sum, order) => sum + order.total, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                    <div className="p-4 text-center rounded-lg bg-blue-50">
                      <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                      <p className="text-sm text-gray-600">Total Customers</p>
                    </div>
                    <div className="p-4 text-center rounded-lg bg-purple-50">
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + order.total, 0) / orders.length) : 0}
                      </p>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                    </div>
                  </div>
                </div>

                {/* Top Items */}
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold">Top Selling Items</h3>
                  <div className="space-y-3">
                    {menuItems.slice(0, 5).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-6 h-6 text-sm text-white bg-red-500 rounded-full">
                            {index + 1}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.price}</p>
                          <p className="text-sm text-gray-600">
                            {Math.floor(Math.random() * 50) + 10} orders
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-screen p-6 overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Order Details - {selectedOrder._id}</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close order modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-semibold">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{selectedOrder.user}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{selectedOrder.selectedAddress?.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{selectedOrder.selectedAddress?.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <span>Payment Method: {selectedOrder.paymentMethod}</span>
                  </div>
                  {selectedOrder.orderNote && (
                    <div className="flex items-center gap-2">
                      <span>Note: {selectedOrder.orderNote}</span>
                    </div>
                  )}
                  {selectedOrder.promoCode && (
                    <div className="flex items-center gap-2">
                      <Gift size={16} />
                      <span>Promo Code: {selectedOrder.promoCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="mb-3 font-semibold">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-gray-600">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium" htmlFor="order-status">
                    Order Status
                  </label>
                  <select
                    id="order-status"
                    value={selectedOrder.isActive ? 'pending' : 'delivered'}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder._id, e.target.value);
                      setSelectedOrder({ ...selectedOrder, isActive: e.target.value === 'pending' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium">Payment Status</label>
                  <button
                    onClick={() => {
                      togglePaymentStatus(selectedOrder._id);
                      setSelectedOrder({
                        ...selectedOrder,
                        isPaid: !selectedOrder.isPaid,
                      });
                    }}
                    className={`w-full px-4 py-2 rounded-lg ${
                      selectedOrder.isPaid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                    aria-label={`Toggle payment status for order ${selectedOrder._id}`}
                  >
                    {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-screen p-6 overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Customer Details - {selectedCustomer.name}</h2>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close customer modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 font-semibold">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-3 font-semibold">Order Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-semibold">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent:</span>
                      <span className="font-semibold">₹{selectedCustomer.totalSpent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Amount:</span>
                      <span
                        className={`font-semibold ${
                          selectedCustomer.pendingAmount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        ₹{selectedCustomer.pendingAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="mb-3 font-semibold">Recent Orders</h3>
                <div className="space-y-2">
                  {orders
                    .filter((order) => order.user === selectedCustomer.email)
                    .slice(0, 5)
                    .map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <span className="font-medium">{order._id}</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total}</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.isActive
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {order.isActive ? 'Pending' : 'Delivered'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showItemModal && <ItemModal />}
      {showCouponModal && <CouponModal />}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};


export default RestaurantAdminDashboard;