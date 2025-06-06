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
  XCircle
} from 'lucide-react';
 
 const OrderCard = ({ order }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800">{order.id}</h3>
          <p className="text-sm text-gray-600">{order.customer}</p>
          <p className="text-sm text-gray-500">{order.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-red-500">₹{order.total}</p>
          <span className={`px-2 py-1 rounded-full text-xs ${
            order.status === 'pending' 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {order.status}
          </span>
        </div>
      </div>
      
      <div className="mb-3 space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setShowOrderModal(true);
          }}
          className="flex-1 px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          View Details
        </button>
        {order.status === 'pending' && (
          <button
            onClick={() => updateOrderStatus(order.id, 'delivered')}
            className="flex-1 px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
          >
            Mark Delivered
          </button>
        )}
        <button
          onClick={() => togglePaymentStatus(order.id)}
          className={`px-3 py-2 rounded text-sm ${
            order.paymentStatus === 'paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
        </button>
      </div>
    </div>
  );

  export default OrderCard;