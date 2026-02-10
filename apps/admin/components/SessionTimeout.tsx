"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes en millisecondes
const REFRESH_INTERVAL = 30 * 1000; // Rafraîchir le timestamp toutes les 30 secondes

export default function SessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const lastRefreshRef = useRef<number>(0);

  // Fonction pour rafraîchir le timestamp de la session
  const refreshSession = async () => {
    try {
      await fetch('/api/session/refresh', { method: 'POST' });
      lastRefreshRef.current = Date.now();
    } catch (error) {
      // Ignorer les erreurs silencieusement
      console.error('Erreur lors du rafraîchissement de la session:', error);
    }
  };

  // Fonction pour réinitialiser le timer
  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    
    // Effacer le timer précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Ne pas activer le timeout sur la page de login
    if (pathname === '/login') {
      return;
    }

    // Rafraîchir le timestamp de la session toutes les 30 secondes
    const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
    if (timeSinceLastRefresh >= REFRESH_INTERVAL) {
      refreshSession();
    }

    // Créer un nouveau timer
    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, INACTIVITY_TIMEOUT);
  };

  // Fonction pour gérer le timeout
  const handleTimeout = async () => {
    try {
      // Vérifier si l'utilisateur est toujours connecté
      const response = await fetch('/api/session');
      const data = await response.json();
      
      if (data.session) {
        // Déconnecter l'utilisateur
        await fetch('/api/logout', { method: 'POST' });
        
        toast.error('Session expirée. Veuillez vous reconnecter.');
        
        // Rediriger vers la page de login
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Rediriger quand même vers la page de login
      router.push('/login');
    }
  };

  useEffect(() => {
    // Ne pas activer le timeout sur la page de login
    if (pathname === '/login') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Événements à écouter pour détecter l'activité
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Fonction pour réinitialiser le timer lors d'une activité
    const onActivity = () => {
      resetTimer();
    };

    // Ajouter les écouteurs d'événements
    events.forEach(event => {
      document.addEventListener(event, onActivity, true);
    });

    // Initialiser le timer
    resetTimer();

    // Créer un intervalle pour rafraîchir la session périodiquement
    refreshTimeoutRef.current = setInterval(() => {
      if (pathname !== '/login') {
        refreshSession();
      }
    }, REFRESH_INTERVAL);

    // Nettoyage
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, onActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  }, [pathname, router]);

  // Réinitialiser le timer quand le pathname change (navigation)
  useEffect(() => {
    if (pathname !== '/login') {
      resetTimer();
    }
  }, [pathname]);

  return null; // Ce composant ne rend rien
}
