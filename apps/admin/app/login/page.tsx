"use client";

import { SectionTitle } from "../../components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        if (data.session && data.session.role === "admin") {
          // Déjà connecté, rediriger vers le dashboard
          router.push("/admin");
        }
      } catch (error) {
        // Ignorer les erreurs, l'utilisateur n'est pas connecté
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Email ou mot de passe incorrect");
        return;
      }

      toast.success("Connexion réussie !");
      // Attendre un peu pour que le cookie soit bien défini
      await new Promise(resolve => setTimeout(resolve, 100));
      // Rediriger vers le dashboard avec un rechargement complet
      window.location.href = "/admin";
    } catch (error: any) {
      console.error("Login exception:", error);
      toast.error(error?.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg-primary min-h-screen">
      <SectionTitle title="Connexion" path="Accueil | Connexion" />
      <div className="flex min-h-[calc(100vh-200px)] flex-1 flex-col justify-center py-12 section">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-8">
                  <h2 className="section-title text-3xl md:text-4xl mb-2">
                    Connectez-vous
                  </h2>
                  <p className="text-brand-text-secondary">
                    Accédez à votre compte TALLEL TEXTILE
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary w-full btn-md"
                    >
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
