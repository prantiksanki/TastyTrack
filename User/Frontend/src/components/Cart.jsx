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
    fetch(`http://localhost:80/address?user=${encodeURIComponent(user)}`, {
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
    fetch(`http://localhost:80/cart?user=${encodeURIComponent(email)}`, {
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
        const response = await fetch('http://localhost:80/coupons', {
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

    if (promo) {
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
      const response = await fetch('http://localhost:80/add-address', {
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
      const response = await fetch('http://localhost:80/order', {
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
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin" style={{ borderColor: '#FF4C29' }}></div>
          <p style={{ color: '#333333' }}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-md px-4 py-8 mx-auto">
          <button onClick={goBack} className="flex items-center mb-6 space-x-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            <span>Back to Menu</span>
          </button>
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="mb-2 text-2xl font-bold" style={{ color: '#333333' }}>Your cart is empty</h2>
            <p className="mb-6 text-gray-600">Add some delicious items to get started</p>
            <button 
              onClick={goBack}
              className="px-6 py-3 font-semibold text-white transition-all rounded-lg hover:shadow-lg"
              style={{ backgroundColor: '#FF4C29' }}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-4xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={goBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            <span>Back to Menu</span>
          </button>
          <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>Your Cart ({cartItems.length})</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Cart Items & Address */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center space-x-2 text-lg font-semibold" style={{ color: '#333333' }}>
                  <MapPin size={20} style={{ color: '#FF4C29' }} />
                  <span>Delivery Address</span>
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  style={{ color: '#FF4C29', borderColor: '#FF4C29' }}
                >
                  Change
                </button>
              </div>
              
              {selectedAddress ? (
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFD93D20' }}>
                    {selectedAddress.type === 'home' ? <Home size={16} style={{ color: '#FF4C29' }} /> : <Building size={16} style={{ color: '#FF4C29' }} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#333333' }}>{selectedAddress.title}</p>
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
                  className="w-full p-2 border-2 border-dashed rounded-lg hover:bg-gray-50"
                  style={{ borderColor: '#FF4C29', color: '#FF4C29' }}
                >
                  + Add Delivery Address
                </button>
              )}
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold" style={{ color: '#333333' }}>Order Items</h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <img src={item.image} alt={item.name || "Cart item"} className="object-cover w-24 h-24 rounded" />
                      <div className="flex-1">
                        <h4 className="mb-1 font-semibold" style={{ color: '#333333' }}>{item.name}</h4>
                        <p className="mb-2 text-sm text-gray-600">{item.description || "No description available."}</p>
                        
                        {item.customizations?.length > 0 && (
                          <div className="mb-3">
                            {item.customizations.map((custom, index) => (
                              <span key={index} className="inline-block px-2 py-1 mb-1 mr-2 text-xs rounded-full" style={{ backgroundColor: '#28C76F20', color: '#28C76F' }}>
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
                              className="p-1 border rounded-full hover:bg-gray-50"
                              style={{ borderColor: '#FF4C29', color: '#FF4C29' }}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 font-semibold text-center" style={{ color: '#333333' }}>{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1 border rounded-full hover:bg-gray-50"
                              style={{ borderColor: '#FF4C29', color: '#FF4C29' }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold" style={{ color: '#333333' }}>₹{item.price * item.quantity}</span>
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
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold" style={{ color: '#333333' }}>
                <StickyNote size={20} style={{ color: '#FF4C29' }} />
                <span>Add Note (Optional)</span>
              </h3>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200"
                rows="3"
              />
            </div>
          </div>

          {/* Right Column - Bill Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="flex items-center mb-4 space-x-2 text-lg font-semibold" style={{ color: '#333333' }}>
                <Tag size={20} style={{ color: '#FF4C29' }} />
                <span>Promo Code</span>
              </h3>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#28C76F20' }}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} style={{ color: '#28C76F' }} />
                    <span className="font-medium" style={{ color: '#28C76F' }}>{appliedPromo.code}</span>
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
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button 
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 py-3 font-semibold text-white rounded-lg hover:shadow-lg"
                    style={{ backgroundColor: '#FF4C29' }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="mb-4 text-lg font-semibold" style={{ color: '#333333' }}>Bill Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
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
                  <span>₹{platformFee}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (0%)</span>
                  <span>₹{gst}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ color: '#333333' }}>Total</span>
                    <span style={{ color: '#FF4C29' }}>₹{total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="mb-4 text-lg font-semibold" style={{ color: '#333333' }}>Payment Method</h3>
              
              <div className="space-y-3">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI', icon: Smartphone },
                  { id: 'wallet', label: 'Wallet', icon: Wallet }
                ].map(({ id, label, icon: Icon }) => (
                  <label key={id} className="flex items-center p-3 space-x-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                      style={{ accentColor: '#FF4C29' }}
                    />
                    <Icon size={20} style={{ color: '#FF4C29' }} />
                    <span style={{ color: '#333333' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="button"
              onClick={placeOrder}
              disabled={orderPlacing}
              className="w-full py-4 text-lg font-bold text-white transition-all rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FF4C29' }}
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

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: '#333333' }}>Select Address</h3>
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
                    selectedAddress?.id === address.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFD93D20' }}>
                      {address.type === 'home' ? <Home size={16} style={{ color: '#FF4C29' }} /> : <Building size={16} style={{ color: '#FF4C29' }} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: '#333333' }}>{address.title}</p>
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
                className="w-full p-4 text-center border-2 border-dashed rounded-lg hover:bg-gray-50"
                style={{ borderColor: '#FF4C29', color: '#FF4C29' }}
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
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: '#333333' }}>Add New Address</h3>
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
                <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>Address Type</label>
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
                        style={{ accentColor: '#FF4C29' }}
                      />
                      <Icon size={16} style={{ color: '#FF4C29' }} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>Name</label>
                <input
                  type="text"
                  value={newAddress.title}
                  onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>Complete Address *</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  placeholder="House/Flat no., Building name, Area"
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>Pincode *</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    placeholder="700001"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: '#333333' }}>Landmark (Optional)</label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                  placeholder="e.g., Near Metro Station"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
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
                  className="flex-1 px-4 py-3 font-semibold text-white rounded-lg hover:shadow-lg"
                  style={{ backgroundColor: '#FF4C29' }}
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