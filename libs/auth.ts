import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import authConfig from '@/libs/auth.config';
import prisma from '@/libs/prismadb';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    // Spread edge-compatible providers from auth.config.ts
    ...authConfig.providers,
    // Credentials provider needs Node.js runtime (bcrypt + prisma)
    Credentials({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.hashedPassword);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  pages: authConfig.pages,
  session: authConfig.session,
  callbacks: {
    async signIn({ user, account }) {
      const customEmail = user?.name + '@' + account?.provider + '.com';

      const exists = await prisma.user.findUnique({
        where: {
          email: (user.email || customEmail) as string,
        },
      });

      if (account?.type === 'oauth' && !exists) {
        const defaultUsername = user?.email ? user.email.split('@')[0] : user?.name;
        try {
          const newUser = await prisma.user.create({
            data: {
              username: defaultUsername,
              name: user.name,
              email: user.email || customEmail,
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
        return true;
      }
      return true;
    },
  },
});
