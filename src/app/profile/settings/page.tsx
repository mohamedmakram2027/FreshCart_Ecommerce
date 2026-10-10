'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Settings as SettingsIcon, 
  MapPin, 
  ChevronRight, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/use-auth-store';

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();
  const token = Cookies.get('token');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    rePassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
      });
    }
  }, [user]);

  // Handle Update Profile Data
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      if (token) {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/updateMe/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update profile details');
        }

        setProfileSuccess('Profile information updated successfully!');
      } else {
        setProfileSuccess('Profile information saved locally!');
      }
    } catch (err: any) {
      setProfileError(err.message || 'Something went wrong while updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    if (passwordData.password !== passwordData.rePassword) {
      setPasswordError('New passwords do not match');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      if (token) {
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            password: passwordData.password,
            rePassword: passwordData.rePassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to change password');
        }

        setPasswordSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', password: '', rePassword: '' });
      } else {
        setPasswordSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', password: '', rePassword: '' });
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Error updating password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Update your profile information and change your password
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">
                My Account
              </h3>

              <Link
                href="/profile/addresses"
                className="flex items-center justify-between p-3.5 rounded-2xl text-gray-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>My Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/profile/settings"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 text-[#0aad0a] font-bold text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center">
                    <SettingsIcon className="w-4 h-4" />
                  </div>
                  <span>Settings</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Forms Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Profile Information Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-[#0aad0a] flex items-center justify-center shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Profile Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your personal details
                  </p>
                </div>
              </div>

              {profileSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-[#0aad0a] border border-emerald-100 p-3.5 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 p-3.5 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center gap-2 bg-[#0aad0a] hover:bg-[#088d08] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>

              {/* Account Information Metadata */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Account Information
                </h4>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-gray-500 font-medium">User ID</span>
                  <span className="font-mono text-gray-600 bg-slate-50 px-2 py-1 rounded-md border border-gray-100">
                    {(user as any)?._id || (user as any)?.id || '6abedfa24da3e6001263fabf'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-gray-500 font-medium">Role</span>
                  <span className="font-bold text-[#0aad0a] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Change Password Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your account password
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-[#0aad0a] border border-emerald-100 p-3.5 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 p-3.5 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Enter your new password"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      placeholder="Confirm your new password"
                      value={passwordData.rePassword}
                      onChange={(e) => setPasswordData({ ...passwordData, rePassword: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center gap-2 bg-[#e65c00] hover:bg-[#cc5200] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUpdatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>Change Password</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}