"use client";

import { SectionTitle } from "@/components";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      console.log("Login result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        toast.error("Email ou mot de passe incorrect");
      } else if (result?.ok) {
        toast.success("Connexion réussie !");
        // Attendre un peu pour que la session soit créée
        await new Promise(resolve => setTimeout(resolve, 100));
        // Utiliser window.location pour forcer une redirection complète
        window.location.href = "/";
      } else {
        // Si pas d'erreur mais pas de succès non plus, rediriger quand même
        console.warn("Login result unclear, redirecting anyway:", result);
        toast.success("Connexion réussie !");
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.href = "/";
      }
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="form-checkbox"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm text-brand-text-secondary"
                      >
                        Se souvenir de moi
                      </label>
                    </div>

                    <a
                      href="#"
                      className="text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
                    >
                      Mot de passe oublié ?
                    </a>
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

                <p className="mt-8 text-center text-sm text-brand-text-secondary">
                  Pas encore de compte ?{" "}
                  <a
                    href="/register"
                    className="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
                  >
                    Créer un compte
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
