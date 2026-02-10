# ✅ Solution aux Warnings NextAuth

## Problèmes Identifiés

1. **`GET http://localhost:3001/ 404 (Not Found)`**
   - ✅ **Normal** : Le backend Express n'a pas de route à la racine `/`
   - Le backend écoute sur `/api/*` uniquement
   - Ce warning peut être ignoré

2. **`[next-auth][warn][NEXTAUTH_URL]`**
   - ✅ **Résolu** : Fichier `.env.local` créé avec `NEXTAUTH_URL=http://localhost:3001`

3. **`[next-auth][warn][DEBUG_ENABLED]`**
   - ✅ **Résolu** : Debug désactivé sauf si `NEXTAUTH_DEBUG=true` est défini
   - Le warning peut encore apparaître en développement, c'est normal

## Fichiers Créés

### `apps/admin/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-key-change-in-production-please
BACKEND_URL=http://localhost:3001
```

### `apps/frontend/.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Actions Requises

1. **Redémarrer le serveur de développement** :
   ```bash
   # Arrêter le serveur actuel (Ctrl+C)
   # Puis redémarrer
   cd apps/admin
   pnpm dev
   ```

2. **Vérifier que le backend est démarré** :
   ```bash
   cd server
   node app.js
   ```

## Résultat Attendu

Après redémarrage :
- ✅ Le warning `NEXTAUTH_URL` devrait disparaître
- ✅ Le warning `DEBUG_ENABLED` peut encore apparaître (normal en dev)
- ✅ Le 404 sur `localhost:3001/` est normal (backend n'a pas de route racine)

## Production

Sur Vercel, configurez ces variables dans les paramètres du projet :
- `NEXTAUTH_URL` → URL de votre déploiement admin
- `NEXTAUTH_SECRET` → Clé secrète générée avec `openssl rand -base64 32`
- `NEXT_PUBLIC_API_BASE_URL` → URL de votre backend
