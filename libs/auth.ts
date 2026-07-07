import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import authConfig from '@/libs/auth.config';
import prisma from '@/libs/prismadb';

// Comma-separated allowlist; only these Google accounts may sign in
const getAllowedEmails = (): string[] =>
  (process.env.ALLOWED_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: authConfig.providers,
  pages: authConfig.pages,
  session: authConfig.session,
  callbacks: {
    async signIn({ user, account }) {
      // Reject anyone not on the allowlist (single-user app)
      const allowedEmails = getAllowedEmails();
      if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
        return false;
      }

      const exists = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (account?.type === 'oauth' && !exists) {
        const defaultUsername = user.email.split('@')[0];
        try {
          const newUser = await prisma.user.create({
            data: {
              username: defaultUsername,
              name: user.name,
              email: user.email,
              emailVerified: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              image: user.image,
            },
          });

          await prisma.account.create({
            data: {
              type: account.type,
              userId: newUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              accessToken: account.access_token,
              tokenType: account.token_type,
              scope: account.scope,
              expiresAt: account.expires_at,
            },
          });
        } catch (error) {
          console.log('error', error);
          return false;
        }
      }
      return true;
    },
  },
});
