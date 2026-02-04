'use client';

import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface HeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

const Header = ({ session }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 z-[1000] flex h-[80px] w-full items-center justify-between border-b border-[#EEEEEE] px-6 md:px-12"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <Link href="/recipes" className="flex items-center gap-3 no-underline">
          <span className="text-xl font-light tracking-wider text-black">好好吃飯</span>
          <span className="hidden text-xs tracking-[2px] text-[#9E9E9E] sm:inline">RECIPES</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/recipes"
            className="text-sm tracking-[0.5px] text-black no-underline transition-opacity duration-300 hover:opacity-60"
          >
            食譜一覽
          </Link>
          {session ? (
            <>
              <Link
                href="/member/recipes"
                className="text-sm tracking-[0.5px] text-black no-underline transition-opacity duration-300 hover:opacity-60"
              >
                管理食譜
              </Link>
              <span className="text-sm text-[#9E9E9E]">{session.username}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border-b border-black bg-transparent pb-1 text-sm tracking-[0.5px] text-black transition-opacity duration-300 hover:opacity-60"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm tracking-[0.5px] text-black no-underline transition-opacity duration-300 hover:opacity-60"
              >
                登入
              </Link>
              <Link
                href="/signup"
                className="border border-black bg-black px-6 py-2 text-sm tracking-[1px] text-white no-underline transition-all duration-300 hover:bg-[#424242]"
              >
                開始使用
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center border border-black bg-transparent md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 z-[999] h-screen w-full bg-white transition-transform duration-[400ms] md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          <Link
            href="/recipes"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg tracking-[2px] text-black no-underline transition-opacity duration-300 hover:opacity-60"
          >
            食譜一覽
          </Link>
          {session ? (
            <>
              <Link
                href="/member/recipes"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg tracking-[2px] text-black no-underline transition-opacity duration-300 hover:opacity-60"
              >
                管理食譜
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="border-b border-black bg-transparent text-lg tracking-[2px] text-black transition-opacity duration-300 hover:opacity-60"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg tracking-[2px] text-black no-underline transition-opacity duration-300 hover:opacity-60"
              >
                登入
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="border border-black bg-black px-8 py-3 text-lg tracking-[2px] text-white no-underline"
              >
                開始使用
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
