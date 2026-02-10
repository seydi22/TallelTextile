// lib/prisma.ts
import { PrismaClient } from '@tallel-textile/prisma';

// Evite de créer de nouvelles instances de PrismaClient en développement
// à cause du Hot Reload de Next.js
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
