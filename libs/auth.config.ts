import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Edge-compatible auth config (no Prisma, used by middleware)
// Single-user app: Google is the only provider; allowlist enforced in libs/auth.ts
export default {
  providers: [Google],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
