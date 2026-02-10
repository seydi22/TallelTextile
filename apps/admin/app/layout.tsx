import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { getSession } from "../utils/adminAuth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tallel Textile - Administration",
  description: "Dashboard d'administration Tallel Textile",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  
  return (
    <html lang="fr" data-theme="tallel">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
