'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes.const';

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-2xl">
            <Mail className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-black tracking-tight leading-tight">
            Check your inbox.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            We've sent a verification link to your email. Click it to activate your merchant studio.
          </p>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col items-center space-y-4">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Didn't receive the email?
          </p>
          <button className="text-black font-black text-sm hover:underline">
            Resend Verification Link
          </button>
        </div>

        <div className="pt-12">
          <Link 
            href={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center text-sm font-black text-gray-500 hover:text-black transition-colors"
          >
            Return to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
