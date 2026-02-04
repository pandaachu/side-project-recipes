'use client';

import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = '搜尋食材、食譜名稱...' }: SearchBarProps) => {
  const [value, setValue] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BDBDBD]" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#E0E0E0] bg-white py-3 pl-11 pr-4 text-sm text-black placeholder-[#BDBDBD] outline-none transition-colors duration-300 focus:border-black"
      />
    </div>
  );
};

export default SearchBar;
