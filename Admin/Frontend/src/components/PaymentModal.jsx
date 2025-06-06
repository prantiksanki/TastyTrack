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
 
 const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add Payment Entry</h2>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addPayment({
            customer: formData.get('customer'),
            amount: parseFloat(formData.get('amount')) * (formData.get('type') === 'debit' ? -1 : 1),
            type: formData.get('type'),
            status: formData.get('status'),
            notes: formData.get('notes')
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Customer</label>
              <input
                name="customer"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Amount</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Type</label>
              <select
                name="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="credit">Credit (Received)</option>
                <option value="debit">Debit (Given)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Status</label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Notes</label>
              <textarea
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  export default PaymentModal;