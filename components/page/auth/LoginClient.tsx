'use client';

import { message } from 'antd';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/recipes';
  // Auth.js redirects here with ?error=AccessDenied when signIn callback rejects
  const hasError = searchParams.has('error');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google login error:', error);
      message.error('登入失敗');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-light tracking-wider">登入</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">LOGIN</span>
      </div>

      {hasError && (
        <p className="mb-6 border border-[#EEEEEE] bg-[#FAFAFA] px-4 py-3 text-center text-sm text-[#9E9E9E]">
          此帳號沒有存取權限
        </p>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 border-none bg-black py-3 text-sm tracking-[1px] text-white transition-all duration-300 hover:bg-[#424242] disabled:opacity-50"
      >
        <FaGoogle />
        使用 Google 登入
      </button>

      <p className="mt-6 text-center text-xs tracking-wider text-[#9E9E9E]">僅限授權帳號使用</p>
    </div>
  );
}
