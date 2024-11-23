import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const client =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query'],
    // log: ['query', 'info', 'warn', 'error'], // 啟用所有類型的日誌
  });
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
