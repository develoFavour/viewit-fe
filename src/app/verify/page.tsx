'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { get } from '@/lib/method';
import { ENDPOINTS } from '@/constants/endpoint.const';
import { ROUTES } from '@/constants/routes.const';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { login } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await get<any>(`${ENDPOINTS.AUTH.VERIFY}?token=${token}`);
        const { accessToken, merchant } = response.data.data;
        
        // Login and sync cookie
        localStorage.setItem('viewit_token', accessToken);
        document.cookie = `viewit_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        
        login(accessToken, merchant);
        setStatus('success');
      } catch (e) {
        setStatus('error');
      }
    };
    verify();
  }, [token, login]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md space-y-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-6">
            <Loader2 className="h-12 w-12 text-black animate-spin" />
            <h2 className="text-2xl font-bold text-black tracking-tight">Verifying your studio...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-black tracking-tight">Verified.</h1>
            <p className="text-gray-500 text-lg">Your account is now active. Welcome to the future of AR commerce.</p>
            <Link
              href={ROUTES.MERCHANT.DASHBOARD}
              className="mt-8 px-10 py-4 bg-black text-white font-black rounded-2xl flex items-center hover:scale-105 transition-all shadow-2xl shadow-gray-200"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-black tracking-tight">Invalid Link.</h1>
            <p className="text-gray-500 text-lg">This link has expired or is invalid. Please try registering again.</p>
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="mt-8 px-10 py-4 bg-gray-100 text-black font-black rounded-2xl flex items-center hover:bg-gray-200 transition-all"
            >
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
