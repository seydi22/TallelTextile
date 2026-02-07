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

// Forcer le rendu dynamique car nous utilisons getServerSession qui nécessite headers()
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Gérer les erreurs de session gracieusement avec timeout
  let session = null;
  try {
    // Ajouter un timeout pour éviter les blocages
    const sessionPromise = getServerSession(authOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session timeout')), 2000)
    );
    
    const result = await Promise.race([sessionPromise, timeoutPromise]);
    // S'assurer que le résultat est bien une session ou null
    session = result && typeof result === 'object' ? result : null;
  } catch (error: any) {
    // Si timeout ou erreur, continuer sans session
    if (error?.message?.includes("timeout")) {
      console.warn("Timeout lors de la récupération de la session, continuation sans session");
    } else if (error?.message?.includes("decryption") || error?.code === "ERR_JWT_DECRYPTION_FAILED") {
      console.warn("Session invalide, l'utilisateur devra se reconnecter");
    } else {
      console.error("Erreur lors de la récupération de la session:", error?.message || error);
    }
    session = null;
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
