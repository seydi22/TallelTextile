# 🔧 Configuration des Variables d'Environnement

## Problème Résolu

**Warnings NextAuth :**
- `[next-auth][warn][NEXTAUTH_URL]` → Variable `NEXTAUTH_URL` non définie
- `[next-auth][warn][DEBUG_ENABLED]` → Debug activé en développement

## Solution

Un fichier `.env.local` a été créé dans `apps/admin/` avec les variables nécessaires.

## Variables d'Environnement Requises

### Pour l'app Admin (`apps/admin/.env.local`)

```env
# URL de base de l'API backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-key-change-in-production-please

# Backend URL (optionnel)
BACKEND_URL=http://localhost:3001
```

### Pour l'app Frontend (`apps/frontend/.env.local`)

```env
# URL de base de l'API backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Notes

1. **404 sur `localhost:3001/`** : C'est normal si le backend Express n'a pas de route à la racine. Le backend écoute sur les routes `/api/*`.

2. **NEXTAUTH_URL** : En développement, utilisez `http://localhost:3001` (port de l'app admin). En production sur Vercel, utilisez l'URL de votre déploiement admin.

3. **NEXTAUTH_SECRET** : En production, générez une clé secrète forte :
   ```bash
   openssl rand -base64 32
   ```

4. **DEBUG_ENABLED** : Le warning apparaît car `debug: true` est activé en développement. C'est normal et peut être ignoré, ou désactivé en définissant `NEXTAUTH_DEBUG=false`.

## Prochaines Étapes

1. **Redémarrer le serveur de développement** :
   ```bash
   cd apps/admin
   pnpm dev
   ```

2. **Vérifier que le backend est démarré** :
   ```bash
   cd server
   node app.js
   ```

3. **Tester la connexion** : Aller sur `http://localhost:3001/login`

## Production (Vercel)

Sur Vercel, configurez ces variables dans les paramètres du projet :
- `NEXTAUTH_URL` → URL de votre déploiement admin (ex: `https://admin.tallel-textile.vercel.app`)
- `NEXTAUTH_SECRET` → Clé secrète générée
- `NEXT_PUBLIC_API_BASE_URL` → URL de votre backend (ex: `https://tallel-textile-j62y.vercel.app/api`)
