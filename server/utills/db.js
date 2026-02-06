// Prefer the root-level Prisma Client (generated from ../prisma/schema.prisma),
// which includes bulk upload models. Fallback to local if not available.
let PrismaClient;
try {
    // When running server/* scripts, this resolves to project root node_modules
    ({ PrismaClient } = require("../../node_modules/@prisma/client"));
} catch (e) {
    ({ PrismaClient } = require("@prisma/client"));
}

const prismaClientSingleton = () => {
    // Validate that DATABASE_URL is present
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    // Parse DATABASE_URL to check SSL configuration
    // Remove quotes if present (common issue with Vercel env vars)
    let databaseUrl = process.env.DATABASE_URL.trim();
    if ((databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) || 
        (databaseUrl.startsWith("'") && databaseUrl.endsWith("'"))) {
        databaseUrl = databaseUrl.slice(1, -1);
    }
    
    const url = new URL(databaseUrl);
    
    // Log SSL configuration for debugging
    if (process.env.NODE_ENV === "development") {
        console.log(` Database connection: ${url.protocol}//${url.hostname}:${url.port || '3306'}`);
        console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
    }

    return new PrismaClient({
        // Add logging for debugging
        log: process.env.NODE_ENV === "development" 
            ? ['query', 'info', 'warn', 'error']
            : ['error', 'warn'],
    });
}

const globalForPrisma = globalThis;

// Lazy initialization - only create Prisma client when first accessed
// This prevents connection attempts during module loading on Vercel
let prismaInstance = null;

const getPrisma = () => {
  if (!prismaInstance) {
    prismaInstance = globalForPrisma.prisma ?? prismaClientSingleton();
    if(process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  }
  return prismaInstance;
};

// Export a getter function instead of the instance directly
// This ensures Prisma is only initialized when actually used
module.exports = new Proxy({}, {
  get(target, prop) {
    const prisma = getPrisma();
    return prisma[prop];
  }
});;