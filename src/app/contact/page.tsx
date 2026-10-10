'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Headphones, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  HelpCircle,
  Share2,
  Globe
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ fullName: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Header Section */}
      <div className="bg-[#0aad0a] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm font-semibold text-emerald-100 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Contact Us</span>
          </nav>

          {/* Title & Subtitle */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner shrink-0">
              <Headphones className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Contact Us</h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-2 font-medium">
                We'd love to hear from you. Get in touch with our team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Contact Info Cards */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Phone</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">Mon-Fri from 8am to 6pm</p>
                <a href="tel:+18001234567" className="text-base font-bold text-[#0aad0a] hover:underline mt-1 inline-block">
                  +1 (800) 123-4567
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Email</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">We'll respond within 24 hours</p>
                <a href="mailto:support@freshcart.com" className="text-base font-bold text-[#0aad0a] hover:underline mt-1 inline-block">
                  support@freshcart.com
                </a>
              </div>
            </div>

            {/* Office Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Office</h3>
                <p className="text-sm text-gray-700 mt-1.5 leading-relaxed font-medium">
                  123 Commerce Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Business Hours</h3>
                <p className="text-sm text-gray-700 mt-1.5 leading-relaxed font-medium">
                  Monday - Friday: 8am - 6pm<br />
                  Saturday: 9am - 4pm<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Follow Us Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a] flex items-center justify-center transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#0aad0a] flex items-center justify-center transition-colors">
                  <Share2 className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Side: Form & Help Center Banner */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Contact Form Container */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0aad0a] flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">Fill out the form and we'll get back to you</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base text-gray-900 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Returns & Refunds">Returns & Refunds</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0aad0a] hover:bg-[#088d08] text-white font-bold rounded-xl px-8 py-3.5 text-base flex items-center gap-3 shadow-md transition-all hover:scale-[1.01]"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Help Center Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0aad0a] text-white flex items-center justify-center shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Looking for quick answers?</h4>
                <p className="text-sm text-gray-700 mt-1 font-medium leading-relaxed">
                  Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.
                </p>
                <Link href="#" className="inline-block text-sm font-bold text-[#0aad0a] hover:underline mt-2">
                  Visit Help Center &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}