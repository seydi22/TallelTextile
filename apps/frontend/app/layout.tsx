import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import HeaderZuma from "@/components/HeaderZuma";
import Footer from "@/components/Footer";

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
  title: "Tallel Textile - Boutique en ligne",
  description: "Boutique en ligne de textiles de qualité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="tallel">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <Providers>
          <HeaderZuma />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
