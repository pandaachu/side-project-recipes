import { Suspense } from 'react';

import LoginClient from '@/components/page/auth/LoginClient';

export default function LoginPage() {
  return (
    <div className="bg-grey-50">
      <div className="flex h-[95%] items-center justify-center">
        {/* Suspense required: LoginClient reads useSearchParams */}
        <Suspense fallback={null}>
          <LoginClient />
        </Suspense>
      </div>
    </div>
  );
}
