import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

let handler: ReturnType<typeof NextAuth>;

try {
  handler = NextAuth(authOptions);
} catch (error) {
  console.error("Error initializing NextAuth:", error);
  // Créer un handler minimal qui retourne une erreur
  handler = NextAuth({
    ...authOptions,
    callbacks: {
      async signIn() {
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = (user as any).role || "user";
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && token) {
          session.user.id = token.id as string;
          session.user.role = (token.role as string) || "user";
        }
        return session;
      },
    },
  });
}

export { handler as GET, handler as POST };
