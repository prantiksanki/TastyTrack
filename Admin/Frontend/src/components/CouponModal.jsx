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
 
 const CouponModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h2>
          <button
            onClick={() => {
              setShowCouponModal(false);
              setEditingCoupon(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addOrUpdateCoupon({
            code: formData.get('code'),
            discount: parseInt(formData.get('discount')),
            type: formData.get('type'),
            minOrder: parseInt(formData.get('minOrder')),
            active: formData.get('active') === 'on'
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Coupon Code</label>
              <input
                name="code"
                type="text"
                defaultValue={editingCoupon?.code || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Discount</label>
              <input
                name="discount"
                type="number"
                defaultValue={editingCoupon?.discount || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Type</label>
              <select
                name="type"
                defaultValue={editingCoupon?.type || 'percentage'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Minimum Order</label>
              <input
                name="minOrder"
                type="number"
                defaultValue={editingCoupon?.minOrder || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="active"
                type="checkbox"
                defaultChecked={editingCoupon?.active || true}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Active</label>
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );


  export default CouponModal;