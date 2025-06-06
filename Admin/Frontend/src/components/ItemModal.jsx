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

const ItemModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={() => {
              setShowItemModal(false);
              setEditingItem(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          addOrUpdateItem({
            name: formData.get('name'),
            price: parseInt(formData.get('price')),
            category: formData.get('category'),
            available: formData.get('available') === 'on'
          });
        }}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                name="name"
                type="text"
                defaultValue={editingItem?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Price</label>
              <input
                name="price"
                type="number"
                defaultValue={editingItem?.price || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Category</label>
              <input
                name="category"
                type="text"
                defaultValue={editingItem?.category || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="available"
                type="checkbox"
                defaultChecked={editingItem?.available || true}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Available</label>
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

  export default ItemModal;