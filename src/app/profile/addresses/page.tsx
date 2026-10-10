'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Phone, 
  Building, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import Cookies from 'js-cookie';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export default function ProfileAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: '',
  });

  const token = Cookies.get('token');

  // Fetch Addresses
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      if (token) {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
          headers: { token },
        });
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setAddresses(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddressId(address._id);
      setFormData({
        name: address.name || '',
        details: address.details || '',
        phone: address.phone || '',
        city: address.city || '',
      });
    } else {
      setEditingAddressId(null);
      setFormData({ name: '', details: '', phone: '', city: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
    setFormData({ name: '', details: '', phone: '', city: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddressId) {
        // Local Edit Update for UI or custom API Endpoint
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddressId ? { ...addr, ...formData } : addr
          )
        );
      } else {
        // Add Address via API
        if (token) {
          const res = await fetch('https://ecommerce.routemisr.com/api/v1/addresses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token,
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (data.status === 'success' && Array.isArray(data.data)) {
            setAddresses(data.data);
          }
        } else {
          // Local fallback
          setAddresses((prev) => [
            ...prev,
            { _id: Date.now().toString(), ...formData },
          ]);
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (token) {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`, {
          method: 'DELETE',
          headers: { token },
        });
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setAddresses(data.data);
          return;
        }
      }
      setAddresses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Green Header Banner */}
      <div className="bg-[#0aad0a] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">My Account</span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">My Account</h1>
              <p className="text-sm text-white/80 mt-0.5">
                Manage your addresses and account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 px-4 pt-2 pb-1">
                My Account
              </h3>

              <Link
                href="/profile/addresses"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 text-[#0aad0a] font-bold text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>My Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href="/profile/settings"
                className="flex items-center justify-between p-3.5 rounded-2xl text-gray-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Right Addresses Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  My Addresses
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your saved delivery addresses
                </p>
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088d08] text-white font-bold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Cards List */}
            {isLoading ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 flex items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No saved addresses</h3>
                <p className="text-xs text-gray-500">
                  Add a delivery address for faster checkout experiences.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative flex flex-col justify-between space-y-4 hover:border-emerald-100 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">
                            {addr.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {addr.details}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenModal(addr)}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-gray-500 hover:text-[#0aad0a] flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(addr._id)}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-50 flex items-center gap-4 text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{addr.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-gray-400" />
                        <span>{addr.city}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ADD / EDIT ADDRESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative border border-gray-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 text-gray-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Address Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home, Office"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Address
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Street, building, apartment..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Cairo"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-xl text-sm transition-colors text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-3 bg-[#0aad0a] hover:bg-[#088d08] text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingAddressId ? (
                    'Save Changes'
                  ) : (
                    'Add Address'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}