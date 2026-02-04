import './globals.css';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { Metadata } from 'next';

import { getCurrentUser } from '@/actions/getCurrentUser';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import SessionAuthProvider from '@/context/providers/SessionAuthProvider';

interface LayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '好好吃飯 | Recipe Collection',
  description: '收集與分享美味食譜',
};

export default async function RootLayout({ children, auth }: LayoutProps) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="zh-Hant">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#000000',
            colorText: '#000000',
            colorTextHeading: '#000000',
            colorTextBase: '#000000',
            colorBorder: '#E0E0E0',
            borderRadius: 0,
            fontFamily:
              "'Helvetica Neue', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          },
          components: {
            Button: {
              primaryShadow: 'none',
              borderRadius: 0,
            },
            Input: {
              borderRadius: 0,
            },
            Card: {
              borderRadius: 0,
            },
          },
        }}
      >
        <body>
          <AntdRegistry>
            <App>
              <Header session={currentUser} />
              <SessionAuthProvider session={currentUser}>
                <main className="min-h-[calc(100vh-80px-80px)] w-full pt-[80px]">
                  {children} {auth}
                </main>
              </SessionAuthProvider>
              <Footer />
            </App>
          </AntdRegistry>
        </body>
      </ConfigProvider>
    </html>
  );
}
