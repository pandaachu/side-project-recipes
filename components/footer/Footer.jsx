'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <div className="flex h-[30px] items-center justify-center px-4">
      <ul className="flex items-center justify-center gap-3 text-xs text-gray-700">
        <li>
          <Link href={'/'}>About</Link>
        </li>
        <li>
          <p className="">Meal © All Rights Reserved.</p>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
