'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import logo from '/public/images/logo.png';

const Logo = () => {
  const router = useRouter();

  return (
    // <Image
    //   src={logo}
    //   alt="logo"
    //   className="block cursor-pointer object-cover"
    //   onClick={() => router.push('/')}
    //   priority
    // />
    // 下方寫法必須加上 width 與 height，或是 fill
    // 如果 width 與 height 的大小不是原始圖片大小，則會出現錯誤
    // 所以必需在 style 中加上 w-auto h-auto
    <Image
      src={logo}
      alt="logo"
      width={30}
      height={30}
      className="h-auto w-auto cursor-pointer rounded-full object-cover md:block"
      priority
      onClick={() => router.push('/')}
    />
  );
};

export default Logo;
