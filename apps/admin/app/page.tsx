import { redirect } from "next/navigation";
import { getSession } from "../utils/adminAuth";

// Page d'accueil de l'app admin
// Redirige vers /login si pas de session, sinon vers /admin
export default async function HomePage() {
  const session = await getSession();
  
  if (session && session.role === "admin") {
    // Utilisateur connecté → rediriger vers le dashboard
    redirect("/admin");
  } else {
    // Pas de session ou pas admin → rediriger vers la page de login
    redirect("/login");
  }
}
