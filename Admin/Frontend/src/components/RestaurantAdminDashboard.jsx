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
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [allOrderLength, setAllOrderLength] = useState(0);
  const baseURL = import.meta.env.VITE_BASE_URL || 'https://tastytrack-admin-backend.onrender.com'; 
    
  // Fetch initial data 
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders
        const ordersResponse = await fetch(`${baseURL}/orders/today`);
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setNewOrderCount(ordersData.length);

        const allOrdersResponse = await fetch(`${baseURL}/ordersall`);
        const allOrdersData = await allOrdersResponse.json();
        setAllOrders(allOrdersData);
        setAllOrderLength(allOrdersData.length);

        // Fetch menu items
        const menuResponse = await fetch(`${baseURL}/menu`);
        if (!menuResponse.ok) throw new Error('Failed to fetch menu items');
        const menuData = await menuResponse.json();
        setMenuItems(menuData);

        // Fetch customers
      
        const customersResponse = await fetch(`${baseURL}/customersDetails`);
        if (!customersResponse.ok) throw new Error('Failed to fetch customers');
        const customersData = await customersResponse.json();
        setCustomers(customersData);

        // Fetch coupons
        const couponsResponse = await fetch(`${baseURL}/coupons`);
        if (!couponsResponse.ok) throw new Error('Failed to fetch coupons');
        const couponsData = await couponsResponse.json();
        setCoupons(couponsData);

        // Fetch payments
        // const paymentsResponse = await fetch('http://localhost:81/payments');
        // if (!paymentsResponse.ok) throw new Error('Failed to fetch payments');
        // const paymentsData = await paymentsResponse.json();
        // setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);


  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`${baseURL}/payments`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      const latestPayments = await response.json();

      setPayments((prevPayments) => {
        const prevIds = new Set(prevPayments.map(p => p._id));
        const latestIds = new Set(latestPayments.map(p => p._id));

        // Update only if new payments exist or previous ones are removed/changed
        const isChanged =
          prevPayments.length !== latestPayments.length ||
          latestPayments.some(p => !prevIds.has(p._id));

        return isChanged ? latestPayments : prevPayments;
      });
    } catch (err) {
      console.error('Error polling payments:', err);
    }
  }, 300000); // every 5 mints

  return () => clearInterval(interval);
}, []);



  // Get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];
const today = getTodayDateString();

// Filter today's orders
const todaysOrders = orders.filter(order => order.createdAt.startsWith(today));

// Count each menu item
const menuCountMap = {};
todaysOrders.forEach(order => {
  order.cartItems.forEach(item => {
    if (menuCountMap[item.name]) {
      menuCountMap[item.name] += item.quantity;
    } else {
      menuCountMap[item.name] = item.quantity;
    }
  });
});

// Convert to array for display
const dailyMenuStats = Object.entries(menuCountMap).map(([name, count]) => ({
  name,
  count,
})).sort((a, b) => b.count - a.count); // Optional: sort by count


  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [error]);



  
  // Poll for new orders
useEffect(() => {
  let interval;

  const startPolling = () => {
    interval = setInterval(async () => {
      if (document.visibilityState !== 'visible') return; // Skip if tab not visible

      try {
        const response = await fetch(`${baseURL}/orders/new`);
        if (!response.ok) throw new Error('Failed to fetch new orders');
        const newOrders = await response.json();

        if (newOrders.length > 0) {
          setOrders((prev) => {
            const existingIds = new Set(prev.map(order => order._id));
            const uniqueNewOrders = newOrders.filter(order => !existingIds.has(order._id));
            return [...prev, ...uniqueNewOrders];
          });
          setNewOrderCount((prev) => prev + newOrders.length);
        }
      } catch (err) {
        console.error('Error fetching new orders:', err);
      }
    }, 30000);
  };

  // Start polling initially
  startPolling();

  // Pause/resume polling on tab visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      if (!interval) startPolling();
    } else {
      clearInterval(interval);
      interval = null;
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup
  return () => {
    clearInterval(interval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);





  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const todayTotal = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.isActive);
  const deliveredOrders = orders.filter((order) => !order.isActive);



const updateOrderStatus = async (orderId, newStatus) => {
  const order = orders.find((o) => o._id === orderId);
  if (!order) return;

  setConfirmMessage(`Are you sure you want to change order ${orderId} status to ${newStatus === 'pending' ? 'Pending' : 'Delivered'}?`);
  setConfirmAction(() => async () => {
    setIsUpdating(true);
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isActive: newStatus === 'pending' } : order
        )
      );
      const response = await fetch(`${baseURL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus === 'pending' }),
      });
      if (!response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, isActive: order.isActive } : order
          )
        );
        throw new Error('Failed to update order status');
      }
      console.log('API response:', await response.json());
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating order status:', err);
      setShowConfirmModal(false);
    } finally {
      setIsUpdating(false);
    }
  });
  setShowConfirmModal(true);
};



const togglePaymentStatus = async (orderId) => {
  const order = orders.find((o) => o._id === orderId);
  if (!order) return;

  const newStatus = !order.isPaid ? 'Paid' : 'Unpaid';
  setConfirmMessage(`Are you sure you want to mark order ${orderId} as ${newStatus}?`);
  setConfirmAction(() => async () => {
    try {
      // Optimistic UI update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, isPaid: !order.isPaid } : order
        )
      );

      const response = await fetch(`${baseURL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: !order.isPaid }),
      });
      if (!response.ok) {
        // Revert optimistic update on failure
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, isPaid: order.isPaid } : order
          )
        );
        throw new Error('Failed to update payment status');
      }
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating payment status:', err);
      setShowConfirmModal(false);
    }
  });
  setShowConfirmModal(true);
};



  const toggleItemAvailability = async (itemId) => {
    try {
      const item = menuItems.find((i) => i._id === itemId);
      const response = await fetch(`${baseURL}/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      });
      if (!response.ok) throw new Error('Failed to update item availability');
      setMenuItems(
        menuItems.map((item) =>
          item._id === itemId ? { ...item, available: !item.available } : item
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating item availability:', err);
    }
  };

  const addOrUpdateItem = async (itemData) => {
    try {
      const formattedItemData = {
        ...itemData,
        price: parseFloat(itemData.price) || 0,
        available: itemData.available === true || itemData.available === 'on',
      };
      console.log(itemData); 
      console.log(editingItem); 

      if (editingItem) {
        const response = await fetch(`${baseURL}/menu/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedItemData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update menu item: ${errorData.message || response.statusText}`);
        }

        const updatedItem = await response.json();
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id ? { ...item, ...updatedItem } : item
          )
        );
      } else {
        const response = await fetch(`${baseURL}/menu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedItemData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to add menu item: ${errorData.message || response.statusText}`);
        }

        const newItem = await response.json();
        setMenuItems([...menuItems, newItem]);
      }

      setShowItemModal(false);
      setEditingItem(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding/updating menu item:', err);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`${baseURL}/menu/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete menu item');
      setMenuItems(menuItems.filter((item) => item._id !== itemId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting menu item:', err);
    }
  };

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
const addOrUpdateCoupon = async (couponData) => {
  try {
    const payload = {
      code: couponData.code,
      discount: couponData.discount,
      type: couponData.type,
      minOrder: couponData.minOrder,
      active: couponData.active,
    };

    let response, data;

    if (couponData._id) {
      // Update coupon
      response = await fetch(`${baseURL}/coupons/${couponData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update coupon');
      data = await response.json();

      setCoupons((prevCoupons) =>
        prevCoupons.map((c) => (c._id === couponData._id ? data.item : c))
      );
    } else {
      // Add coupon
      response = await fetch(`${baseURL}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to add coupon');
      data = await response.json();

      setCoupons((prevCoupons) => [...prevCoupons, data.item]);
    }

    setShowCouponModal(false);
    setEditingCoupon(null);
  } catch (err) {
    setError(err.message);
    console.error('Error adding/updating coupon:', err);
  }
};


const deleteCoupon = async (couponId) => {
  try {
    const response = await fetch(`${baseURL}/coupons/${couponId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete coupon');

    // Remove deleted coupon from state
    setCoupons((prevCoupons) => prevCoupons.filter((c) => c._id !== couponId));
  } catch (err) {
    setError(err.message);
    console.error('Error deleting coupon:', err);
  }
};

  // constTButton = ({ id, icon: Icon, label, badge }) => (
  //   <button
  //     onClick={() => setActiveTab(id)}
  //     className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors relative ${
  //       activeTab === id ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'
  //     }`}
  //     aria-current={activeTab === id ? 'page' : undefined}
  //   >
  //     <Icon size={20} />
  //     <span className="font-medium">{label}</span>
  //     {badge > 0 && (
  //       <span className="absolute px-2 py-1 text-xs bg-yellow-400 rounded-full -top-2 -right-2">
  //         {badge}
  //       </span>
  //     )}
  //   </button>
  // );

  const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Confirm Action</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close confirmation modal"
        >
          <X size={24} />
        </button>
      </div>
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          aria-label="Cancel action"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          aria-label="Confirm action"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// {showConfirmModal && (
//   <ConfirmationModal
//     message={confirmMessage}
//     onConfirm={() => {
//       if (confirmAction) confirmAction();
//       setShowConfirmModal(false);
//     }}
//     onCancel={() => {
//       setShowConfirmModal(false);
//       setConfirmAction(null);
//     }}
//   />
// )}




const OrderCard = ({ order }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-bold text-gray-800">Order ID: {order._id}</h3>
        <p className="text-sm text-gray-500">{order.selectedAddress?.title}</p>
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
          disabled={isUpdating}
          className={`flex-1 px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600 ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={`Mark order ${order._id} as delivered`}
        >
          Mark Delivered
        </button>
      )}

      <button
        onClick={() => togglePaymentStatus(order._id)}
        disabled={isUpdating}
        className={`px-3 py-2 rounded text-sm ${
          order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={`Toggle payment status for order ${order._id}`}
      >
        {order.isPaid ? 'Paid' : 'Unpaid'}
      </button>
    </div>
  </div>
);



  const ItemModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button
            onClick={() => {
              setShowItemModal(false);
              setEditingItem(null);
            }}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close item modal"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addOrUpdateItem({
              name: formData.get('name'),
              description: formData.get('description'),
              price: parseFloat(formData.get('price')),
              category: formData.get('category'),
              image: formData.get('image'),
              available: formData.get('available') === 'on',
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="item-name">
                Item Name
              </label>
              <input
                id="item-name"
                name="name"
                type="text"
                defaultValue={editingItem?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="item-description">
                Description
              </label>
              <textarea
                id="item-description"
                name="description"
                defaultValue={editingItem?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="item-price">
                Price
              </label>
              <input
                id="item-price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingItem?.price || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="item-category">
                Category
              </label>
              <input
                id="item-category"
                name="category"
                type="text"
                defaultValue={editingItem?.category || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="item-image">
                Image URL
              </label>
              <input
                id="item-image"
                name="image"
                type="text"
                defaultValue={editingItem?.image || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="item-available"
                name="available"
                type="checkbox"
                defaultChecked={editingItem?.available ?? true}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium" htmlFor="item-available">
                Available
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowItemModal(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Cancel item changes"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              aria-label="Save item"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
const CouponModal = ({
  editingCoupon,
  setEditingCoupon,
  setShowCouponModal,
  coupons,
  setCoupons,
  addOrUpdateCoupon,
}) => {
  const [formState, setFormState] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minOrder: '',
    active: true,
  });
  const [formError, setFormError] = useState(null);

  // Initialize form state when editingCoupon changes
  useEffect(() => {
    if (editingCoupon) {
      setFormState({
        code: editingCoupon.code || '',
        discount: editingCoupon.discount?.toString() || '',
        type: editingCoupon.type || 'percentage',
        minOrder: editingCoupon.minOrder?.toString() || '',
        active: editingCoupon.active ?? true,
      });
    } else {
      setFormState({
        code: '',
        discount: '',
        type: 'percentage',
        minOrder: '',
        active: true,
      });
    }
  }, [editingCoupon]);

  // Handle input changes including checkbox
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormError(null); // Clear error on input change
  };

  // Submit form and call addOrUpdateCoupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formState.code.trim()) {
      setFormError('Coupon code is required');
      return;
    }
    if (!formState.discount || parseInt(formState.discount, 10) <= 0) {
      setFormError('Discount must be a positive number');
      return;
    }
    if (!formState.minOrder || parseInt(formState.minOrder, 10) < 0) {
      setFormError('Minimum order must be a non-negative number');
      return;
    }

    try {
      await addOrUpdateCoupon({
        code: formState.code.trim(),
        discount: parseInt(formState.discount, 10) || 0,
        type: formState.type,
        minOrder: parseInt(formState.minOrder, 10) || 0,
        active: formState.active,
        _id: editingCoupon?._id,
      });
    } catch (err) {
      setFormError(err.message || 'Failed to save coupon');
    }
  };

  // Close and reset modal
  const handleClose = () => {
    setShowCouponModal(false);
    setEditingCoupon(null);
    setFormState({
      code: '',
      discount: '',
      type: 'percentage',
      minOrder: '',
      active: true,
    });
    setFormError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700" aria-label="Close coupon modal">
            <X size={24} />
          </button>
        </div>

        {formError && (
          <div className="flex items-center justify-between p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              {formError}
            </div>
            <button
              onClick={() => setFormError(null)}
              className="text-red-800 hover:text-red-900"
              aria-label="Dismiss error"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="coupon-code" className="block mb-1 text-sm font-medium">Coupon Code</label>
              <input
                id="coupon-code"
                name="code"
                type="text"
                value={formState.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="coupon-discount" className="block mb-1 text-sm font-medium">Discount</label>
              <input
                id="coupon-discount"
                name="discount"
                type="number"
                value={formState.discount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
                min="1"
              />
            </div>

            <div>
              <label htmlFor="coupon-type" className="block mb-1 text-sm font-medium">Type</label>
              <select
                id="coupon-type"
                name="type"
                value={formState.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label htmlFor="coupon-minOrder" className="block mb-1 text-sm font-medium">Minimum Order</label>
              <input
                id="coupon-minOrder"
                name="minOrder"
                type="number"
                value={formState.minOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
                min="0"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="coupon-active"
                name="active"
                type="checkbox"
                checked={formState.active}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label htmlFor="coupon-active" className="text-sm font-medium">Active</label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
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
};

  
const PaymentModal = ({ setShowPaymentModal, setPayments, setError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const paymentData = {
      customer: formData.get('customer'),
      amount:
        parseFloat(formData.get('amount')) * (formData.get('type') === 'debit' ? -1 : 1),
      type: formData.get('type'),
      status: formData.get('status'),
      notes: formData.get('notes'),
    };

    try {
      const response = await fetch(`${baseURL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add payment entry');
      }

      // Fetch updated payments list after successful add
      const paymentsResponse = await fetch(`${baseURL}/payments`);
      if (!paymentsResponse.ok) throw new Error('Failed to fetch payments');
      const paymentsData = await paymentsResponse.json();

      setPayments(paymentsData);
      setShowPaymentModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error submitting payment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Payment Entry</h2>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close payment modal"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <option value="credit">Credit (Receive)</option>
                <option value="debit">Debit (Give)</option>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Cancel payment entry"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              aria-label="Add payment entry"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* <div className="flex items-center gap-4">
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
            </div> */}
          </div>
        </div>
      </header>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-center justify-between p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-800 hover:text-red-900"
              aria-label="Dismiss error"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {isLoading && (
          <div className="p-4 text-center text-gray-600">Loading...</div>
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


            {showConfirmModal && (
                <ConfirmationModal
                  message={confirmMessage}
                  onConfirm={() => {
                    confirmAction();
                    setShowConfirmModal(false);
                  }}
                  onCancel={() => setShowConfirmModal(false)}
                />
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
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-12 h-12 mr-4 rounded"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{item.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleItemAvailability(item._id)}
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
                                onClick={() => deleteItem(item._id)}
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
                    onClick={() => {
                      setEditingCoupon(null);
                      setShowCouponModal(true);
                    }}
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
                            onClick={() => deleteCoupon(coupon._id)}
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
                            addOrUpdateCoupon({ ...coupon, active: !coupon.active });
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

    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Monthly Report</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 text-center rounded-lg bg-red-50">
          <p className="text-2xl font-bold text-red-600">{orders.length}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="p-4 text-center rounded-lg bg-green-50">
          <p className="text-2xl font-bold text-green-600">
            ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
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

    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Today's Menu Sales Count</h3>
      {dailyMenuStats.length === 0 ? (
        <p className="text-sm text-gray-500">No orders placed today.</p>
      ) : (
        <div className="space-y-3">
          {dailyMenuStats.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-700">{item.count} orders</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

          </div>
        </div>
      </div>

{showOrderModal && selectedOrder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black bg-opacity-50">
    <div className="w-full max-w-md max-h-[90vh] p-4 sm:p-6 overflow-y-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold break-words sm:text-xl">
          Order Details - {selectedOrder._id}
        </h2>
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
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span className="break-all">{selectedOrder.user}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="break-words">{selectedOrder.selectedAddress?.address}</span>
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
                <span className="font-medium">Note:</span>
                <span className="break-words">{selectedOrder.orderNote}</span>
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
          <div className="space-y-2 text-sm">
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

        {/* Status Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
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

              <div>
                <h3 className="mb-3 font-semibold">Recent Orders</h3>
                <div className="space-y-2">
                      {allOrders
                        .filter((order) => order.user === selectedCustomer.email)
                        .map((order) => (
                          <div
                            key={order._id}
                            className="p-4 mb-6 rounded-lg shadow-sm bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-medium">Order ID: {order._id}</span>
                                <span className="ml-2 text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{order.total}</p>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    order.isPaid
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {order.isPaid ? 'Paid' : 'Pending'}
                                </span>
                              </div>
                            </div>

                            {/* Order Status */}
                            {/* <div className="mb-2 text-sm text-gray-700">
                              <strong>Status:</strong> {order.status}
                            </div> */}

                            {/* Address */}
                            <div className="mb-2 text-sm text-gray-700">
                              <strong>Deliver to:</strong> {order.selectedAddress?.title} <br />
                              {order.selectedAddress?.address}, {order.selectedAddress?.city} - {order.selectedAddress?.pincode}<br />
                              <span className="text-xs italic">Landmark: {order.selectedAddress?.landmark}</span>
                            </div>

                            {/* Payment and Promo */}
                            <div className="mb-2 space-y-1 text-sm text-gray-700">
                              <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                              {order.promoCode && <div><strong>Promo Code:</strong> {order.promoCode}</div>}
                              {order.orderNote && <div><strong>Note:</strong> {order.orderNote}</div>}
                            </div>

                            {/* Cart Items */}
                            <div className="mt-4 space-y-2">
                              {order.cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 p-3 bg-white border rounded-md">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-cover w-16 h-16 rounded"
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                                    {item.description && (
                                      <p className="text-sm italic text-gray-500">{item.description}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
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
{showCouponModal && (
  <CouponModal
    editingCoupon={editingCoupon}
    setEditingCoupon={setEditingCoupon}
    setShowCouponModal={setShowCouponModal}
    coupons={coupons}
    setCoupons={setCoupons}
    addOrUpdateCoupon={addOrUpdateCoupon}
  />
)}      

{showPaymentModal && <PaymentModal
                            setShowPaymentModal={setShowPaymentModal}
                            setPayments={setPayments}
                            setError={setError}
                          />
}

</div>

    
  );
};

export default RestaurantAdminDashboard;