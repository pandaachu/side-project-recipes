import NextAuth from 'next-auth';

import authConfig from '@/libs/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/member')) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/member/:path*'],
};
