import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import 'svgmap/dist/svgMap.min.css';
import SessionProvider from "@/utils/SessionProvider";
import Header from "@/components/Header";
import HeaderZuma from "@/components/HeaderZuma";
import Footer from "@/components/Footer";
import Providers from "@/Providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Talel Textile",
  description: "Vente de vêtements en ligne",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Gérer les erreurs de session gracieusement
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    // Si erreur de décryptage JWT, ignorer silencieusement (session invalide)
    // Cela peut arriver si NEXTAUTH_SECRET a changé ou si les cookies sont corrompus
    if (error?.message?.includes("decryption") || error?.code === "ERR_JWT_DECRYPTION_FAILED") {
      console.warn("Session invalide, l'utilisateur devra se reconnecter");
      session = null;
    } else {
      // Pour les autres erreurs, les logger mais continuer
      console.error("Erreur lors de la récupération de la session:", error?.message || error);
      session = null;
    }
  }
  
  return (
    <html lang="fr" data-theme="tallel" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <SessionProvider session={session}>
          <HeaderZuma />
          <Providers>
            {children}
          </Providers>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
