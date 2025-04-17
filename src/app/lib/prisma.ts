import { PrismaClient } from '@prisma/client';

// 防止开发环境中热重载创建多个实例
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建或复用 Prisma 客户端实例
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 非生产环境下将 prisma 赋值给 global 对象，避免热重载时创建多个连接
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
