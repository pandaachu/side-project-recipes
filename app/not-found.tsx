import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center">
      <div className="...">404</div>
      <h2 className="mb-4 text-5xl font-bold">Page not found</h2>
      <div className="flex justify-center gap-4">
        <Link href="/" className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-950">
          回到首頁
        </Link>
      </div>
    </div>
  );
}
