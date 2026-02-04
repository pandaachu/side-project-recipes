'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-[#EEEEEE] bg-[#FAFAFA] px-6 py-12 md:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
          <Link
            href="/recipes"
            className="text-sm text-black no-underline transition-opacity duration-300 hover:opacity-60"
          >
            食譜一覽
          </Link>
          <Link
            href="/member/recipes"
            className="text-sm text-black no-underline transition-opacity duration-300 hover:opacity-60"
          >
            管理食譜
          </Link>
        </div>
        <p className="text-center text-xs text-[#9E9E9E]">
          &copy; {new Date().getFullYear()} 好好吃飯. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
