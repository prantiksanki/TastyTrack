import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  Clock, 
  CreditCard, 
  Wallet, 
  Smartphone,
  Home,
  Building,
  StickyNote,
  Tag,
  Info,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  // State declarations
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [validPromoCodes, setValidPromoCodes] = useState({});
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    title: '',
    address: '',
    city: 'Kolkata',
    pincode: '',
    landmark: ''
  });
  const baseURL = import.meta.env.VITE_BASE_URL || 'https://tastytrack-user-backend.onrender.com';

  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const email = localStorage.getItem('email');
    const isValid = localStorage.getItem('isValid');

    if (!email || !isValid) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch saved addresses
  useEffect(() => {
    const user = localStorage.getItem("email");
    fetch(`${baseURL}/address?user=${encodeURIComponent(user)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Addresses:", data);
        setSavedAddresses(data);
        setSelectedAddress(data.find(addr => addr.isDefault));
      })
      .catch(error => {
        console.error("Error fetching addresses:", error);
      });
  }, []);

  // Fetch cart items
  useEffect(() => {
    const email = localStorage.getItem('email');
    fetch(`${baseURL}/cart?user=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Cart items:', data);
        setCartItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cart items:', err);
        setIsLoading(false);
      });
  }, []);

  // Fetch promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await fetch(`${baseURL}/coupons`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        const formattedCodes = {};
        data.forEach(coupon => {
          formattedCodes[coupon.code.toUpperCase()] = {
            discount: coupon.discount,
            type: coupon.type,
            minOrder: coupon.minOrder || 0,
            active: coupon.active
          };
        });

        setValidPromoCodes(formattedCodes);
      } catch (error) {
        console.error('Error fetching promo codes:', error);
      }
    };

    fetchPromoCodes();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    const promo = validPromoCodes[code];

    if (promo.active) {
      if (subtotal >= promo.minOrder) {
        setAppliedPromo({
          code,
          ...promo
        });
        setPromoCode('');
      } else {
        alert(`Minimum order amount ₹${promo.minOrder || 0} required to use this promo code.`);
      }
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const addNewAddress = async () => {
    // Validate required fields
    if (!newAddress.title || !newAddress.address || !newAddress.pincode) {
      alert('Please fill all required fields');
      return;
    }

    const addressData = {
      user: localStorage.getItem("email"),
      ...newAddress
    };

    console.log("New address data:", addressData);

    try {
      const response = await fetch(`${baseURL}/add-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(addressData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to add address: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log("Address added:", data);
      setSavedAddresses(prev => [...prev, data]);
      if (!selectedAddress) setSelectedAddress(data);
      
      // Reset the form and close the modal
      setShowAddAddressModal(false);
      setNewAddress({
        type: 'home',
        title: '',
        address: '',
        city: 'Kolkata',
        pincode: '',
        landmark: ''
      });
    } catch (error) {
      console.error("Error adding address:", error);
      alert('An error occurred while adding the address. Please try again.');
    }
  };

  const handleCart = () => {
    window.location.reload();
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 0 : 40;
  const platformFee = 0;
  const gst = 0;

  let discount = 0;
  if (appliedPromo) {
    if (subtotal >= appliedPromo.minOrder) {
      discount = appliedPromo.type === 'percentage'
        ? Math.round(subtotal * appliedPromo.discount / 100)
        : appliedPromo.discount;
    } else {
      alert(`Order value dropped below ₹${appliedPromo.minOrder}. Promo code removed.`);
      removePromoCode();
    }
  }

  const total = subtotal + deliveryFee + platformFee + gst - discount;

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setOrderPlacing(true);

    try {
      const response = await fetch(`${baseURL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user: localStorage.getItem('email'),
          selectedAddress,
          cartItems,
          promoCode: appliedPromo ? appliedPromo.code : '',
          paymentMethod,
          total,
          orderNote
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      alert('Order placed successfully! 🎉');
      console.log('Order response:', data);
      handleCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    } finally {
      setOrderPlacing(false);
    }
  };

  const goBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-500 rounded-full animate-spin"></div>
          <p className="text-gray-900">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
        <div className="max-w-md px-4 py-8 mx-auto">
          <button onClick={goBack} className="flex items-center mb-6 space-x-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            <span>Back to Menu</span>
          </button>
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mb-6 text-gray-600">Add some delicious items to get started</p>
            <button 
              onClick={goBack}
              className="px-6 py-3 font-semibold text-white transition-all bg-green-500 rounded-full hover:shadow-lg hover:scale-105"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f1e8 0%, #ede4d8 100%)' }}>
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute w-16 h-16 top-10 left-10 opacity-20">
          <div className="w-full h-1 transform rotate-45 bg-green-500 rounded"></div>
          <div className="w-full h-1 -mt-1 transform -rotate-45 bg-green-500 rounded"></div>
        </div>
        <div className="absolute w-12 h-12 bg-red-400 rounded-full top-20 right-20 opacity-20"></div>
        <div className="absolute w-8 h-8 bg-green-500 rounded-full bottom-20 left-1/4 opacity-30"></div>
        <div className="absolute w-6 h-6 bg-red-500 rounded-full bottom-32 right-1/3 opacity-40"></div>

        {/* Floating vegetables */}
        <div className="absolute w-16 h-16 top-1/4 right-10 opacity-60">
          🍅
        </div>
        <div className="absolute w-12 h-12 bottom-1/4 right-20 opacity-60">
          🍅
        </div>
        <div className="absolute opacity-50 top-1/3 left-1/4 w-14 h-14">
          🥬
        </div>
        <div className="absolute w-12 h-12 opacity-50 bottom-20 right-10">
          🥬
        </div>

        <div className="max-w-5xl px-4 py-8 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={goBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft size={20} />
              <span>Back to Menu</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart ({cartItems.length})</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Cart Items & Address */}
            <div className="space-y-6 lg:col-span-2">
              {/* Delivery Address */}
              <div className="p-6 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <MapPin size={20} className="text-green-500" />
                    <span>Delivery Address</span>
                  </h3>
                  <button 
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded-full hover:bg-green-50"
                  >
                    Change
                  </button>
                </div>
                
                {selectedAddress ? (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      {selectedAddress.type === 'home' ? <Home size={16} className="text-green-500" /> : <Building size={16} className="text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedAddress.title}</p>
                      <p className="text-sm text-gray-600">{selectedAddress.address}</p>
                      <p className="text-sm text-gray-600">{selectedAddress.city} - {selectedAddress.pincode}</p>
                      {selectedAddress.landmark && (
                        <p className="text-sm text-gray-500">Landmark: {selectedAddress.landmark}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="w-full p-2 text-green-500 border-2 border-green-500 border-dashed rounded-lg hover:bg-green-50"
                  >
                    + Add Delivery Address
                  </button>
                )}
              </div>

              {/* Cart Items */}
              <div className="shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img src={item.image} alt={item.name || "Cart item"} className="object-cover w-24 h-24 rounded-lg" />
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold text-gray-900">{item.name}</h4>
                          <p className="mb-2 text-sm text-gray-600">{item.description || "No description available."}</p>
                          
                          {item.customizations?.length > 0 && (
                            <div className="mb-3">
                              {item.customizations.map((custom, index) => (
                                <span key={index} className="inline-block px-2 py-1 mb-1 mr-2 text-xs text-green-500 rounded-full bg-green-500/10">
                                  {custom}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="p-1 text-green-500 border border-green-500 rounded-full hover:bg-green-50"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-8 font-semibold text-center text-gray-900">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="p-1 text-green-500 border border-green-500 rounded-full hover:bg-green-50"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => removeItem(item._id)}
                                className="p-1 text-red-500 rounded hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note */}
              <div className="p-6 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold text-gray-900">
                  <StickyNote size={20} className="text-green-500" />
                  <span>Add Note (Optional)</span>
                </h3>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-200"
                  rows="3"
                />
              </div>
            </div>

            {/* Right Column - Bill Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <div className="p-6 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold text-gray-900">
                  <Tag size={20} className="text-green-500" />
                  <span>Promo Code</span>
                </h3>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="font-medium text-green-500">{appliedPromo.code}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                    <button 
                      type="button"
                      onClick={applyPromoCode}
                      className="px-4 py-3 font-semibold text-white bg-green-500 rounded-full hover:shadow-lg hover:scale-105"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              <div className="p-6 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Bill Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1 text-gray-600">
                      <span>Delivery Fee</span>
                      {deliveryFee === 0 && <Info size={14} className="text-green-500" />}
                    </span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-500">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="text-gray-900">₹{platformFee}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (0%)</span>
                    <span className="text-gray-900">₹{gst}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-green-500">₹{total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h3>
                
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI', icon: Smartphone },
                    { id: 'wallet', label: 'Wallet', icon: Wallet }
                  ].map(({ id, label, icon: Icon }) => (
                    <label key={id} className="flex items-center p-3 space-x-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                        style={{ accentColor: '#28C76F' }}
                      />
                      <Icon size={20} className="text-green-500" />
                      <span className="text-gray-900">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={placeOrder}
                disabled={orderPlacing}
                className="w-full py-4 text-lg font-bold text-white transition-all bg-green-500 rounded-full hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderPlacing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  `Place Order • ₹${total}`
                )}
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Estimated delivery: 25-30 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Address</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddressModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {savedAddresses.map((address) => (
                <div 
                  key={address.id}
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                  }}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedAddress?.id === address.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      {address.type === 'home' ? <Home size={16} className="text-green-500" /> : <Building size={16} className="text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{address.title}</p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">{address.city} - {address.pincode}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button"
                onClick={() => {
                  setShowAddressModal(false);
                  setShowAddAddressModal(true);
                }}
                className="w-full p-4 text-center text-green-500 border-2 border-green-500 border-dashed rounded-lg hover:bg-green-50"
              >
                + Add New Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddAddressModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Address Type</label>
                <div className="flex space-x-4">
                  {[
                    { value: 'home', label: 'Home', icon: Home },
                    { value: 'work', label: 'Work', icon: Building },
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="addressType"
                        value={value}
                        checked={newAddress.type === value}
                        onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                        style={{ accentColor: '#28C76F' }}
                      />
                      <Icon size={16} className="text-green-500" />
                      <span className="text-gray-900">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <input
                  type="text"
                  value={newAddress.title}
                  onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Complete Address *</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  placeholder="House/Flat no., Building name, Area"
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-200"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">Pincode *</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    placeholder="700001"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Landmark (Optional)</label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                  placeholder="e.g., Near Metro Station"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              
              <div className="flex pt-4 space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={addNewAddress}
                  className="flex-1 px-4 py-3 font-semibold text-white bg-green-500 rounded-full hover:shadow-lg hover:scale-105"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;