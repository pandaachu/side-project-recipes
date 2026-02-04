import type { NextAuthConfig } from 'next-auth';
import Facebook from 'next-auth/providers/facebook';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Line from 'next-auth/providers/line';

// Edge-compatible auth config (no Prisma/bcrypt, used by middleware)
// Credentials provider is added in libs/auth.ts since it needs Node.js runtime
export default {
  providers: [
    Google,
    Facebook,
    GitHub,
    Line({
      authorization: { params: { scope: 'openid email profile' } },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
