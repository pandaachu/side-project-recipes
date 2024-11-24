import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import LineProvider from 'next-auth/providers/line';

import prisma from '@/libs/prismadb';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    LineProvider({
      // 填上 Line login 的 Channel id & secret
      clientId: process.env.LINE_CHANNEL_ID as string,
      clientSecret: process.env.LINE_CHANNEL_SECRET as string,
      // 如果要取得 email 則需要重新定義 scope 選項，預設只有`openid`、`profile`，因此要再加上 `email`
      // 且也需在 LINE Developer 中將 OpenID Connect 裡的 Email address permission  打開
      authorization: { params: { scope: 'openid email profile' } },
    }),
    CredentialsProvider({
      // 使用自定義的 Username / Email 和 Password 等憑證進行身份驗證，可連接至 db 設定權限
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error('Invalid credentials');
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isValid) throw new Error('Invalid credentials');

        return user;
      },
    }),
  ],
  pages: {
    // 但透過將 signIn: '/login' 加入我們的 pages 選項，使用者將會導向到我們的自訂登入頁面，而不是 NextAuth.js 的預設頁面。
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🚀 ~ signIn ~ profile:', profile);
      // console.log('🚀 ~ signIn ~ account:', account);
      // console.log('🚀 ~ signIn ~ user:', user);
      const customEmail = user?.name + '@' + account?.provider + '.com';

      // 設定登入時將user的name 設為 prisma 的username
      // 檢查是否已經有相同 email 的 user
      const exists = await prisma.user.findUnique({
        where: {
          email: (user.email || customEmail) as string,
        },
      });
      // 如果是第一次登入，則將 user 資料存入 prisma
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
};
