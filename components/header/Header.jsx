'use client';

// import Image from 'next/image';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import Logo from './components/Logo';

const Header = ({ session }) => {
  const router = useRouter();
  console.log(session, 'session');

  return (
    <>
      <header className="sticky top-0 z-10 flex h-[80px] items-center justify-between border-b border-primary bg-white px-4">
        <div className="flex items-center gap-3">
          <Logo></Logo>
          {/* <span>吃一頓好飯</span> */}
          <span>好好吃飯</span>
        </div>
        <div>
          {session ? (
            <div className="flex items-center gap-3">
              <span>{session.username}</span>
              <Button shape="round" variant="outline" onClick={() => router.push('/member/recipes')}>
                管理食譜
              </Button>
              <Button shape="round" variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                登出
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button shape="round" type="text">
                <Link href="/login">登入</Link>
              </Button>
              <Button type="primary" shape="round">
                <Link href="/signup">開始使用</Link>
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
