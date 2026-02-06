/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    DATABASE_URL?: string;
    NODE_ENV?: string;
    NEXTAUTH_SECRET?: string;
    NEXTAUTH_URL?: string;
    NEXT_PUBLIC_API_BASE_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    VERCEL_URL?: string;
    FRONTEND_URL?: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
