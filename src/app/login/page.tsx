'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, ShieldCheck, Truck, Award, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/use-auth-store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      if (data.token) {
        useAuthStore.getState().setAuth(data.user, data.token);
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to login. Please check your network and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side: Brand & Features */}
        <div className="lg:col-span-5 space-y-8 pr-0 lg:pr-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back to <span className="text-[#0aad0a]">FreshCart</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Sign in to manage your orders, wishlist, and enjoy seamless grocery shopping.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 flex items-center justify-center text-[#0aad0a] shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Premium Quality</h3>
                <p className="text-sm text-gray-500 leading-normal">Premium quality products sourced from trusted suppliers.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 flex items-center justify-center text-[#0aad0a] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Fast Delivery</h3>
                <p className="text-sm text-gray-500 leading-normal">Same-day delivery available in most areas</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100/80 flex items-center justify-center text-[#0aad0a] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Secure Shopping</h3>
                <p className="text-sm text-gray-500 leading-normal">Your data and payments are completely secure</p>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#0aad0a] font-bold flex items-center justify-center text-base">
                SJ
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Sarah Johnson</h4>
                <div className="flex items-center text-amber-400 gap-0.5 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              &quot;FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!&quot;
            </p>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase">
              or
            </span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium border border-red-100 text-center mb-5">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                disabled={isLoading}
                placeholder="ali@example.com"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all disabled:opacity-50"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Password<span className="text-red-500">*</span>
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#0aad0a] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                {...register('password')}
                type="password"
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#0aad0a] focus:ring-1 focus:ring-[#0aad0a] transition-all disabled:opacity-50"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0aad0a] hover:bg-[#088d08] text-white font-bold py-3.5 rounded-xl transition-colors text-base shadow-sm mt-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-[#0aad0a] hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}