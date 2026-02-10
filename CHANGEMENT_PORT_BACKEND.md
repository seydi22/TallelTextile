# ✅ Changement du Port Backend

## Modification Effectuée

Le port du backend a été changé de **3001** à **5000** pour éviter les conflits.

## Fichiers Modifiés

### 1. Backend (`server/app.js`)
- ✅ Port par défaut changé : `3001` → `5000`
- ✅ CORS mis à jour pour autoriser `http://localhost:5000`

### 2. Configuration Partagée (`packages/shared/lib/config.ts`)
- ✅ Port de développement changé : `3001` → `5000`

### 3. API Client (`packages/shared/lib/api.ts`)
- ✅ Port de développement changé : `3001` → `5000`

### 4. NextAuth (`apps/admin/lib/authOptions.ts`)
- ✅ Port backend changé : `3001` → `5000`

### 5. Variables d'Environnement
- ✅ `apps/admin/.env.local` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`
- ✅ `apps/admin/.env.local` → `BACKEND_URL=http://localhost:5000`
- ✅ `apps/frontend/.env.local` → `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`

## Ports Utilisés

- **Frontend** : `3000` (inchangé)
- **Admin** : `3001` (inchangé)
- **Backend** : `5000` (changé depuis 3001)

## Prochaines Étapes

1. **Redémarrer le backend** :
   ```bash
   cd server
   node app.js
   ```
   Le backend devrait maintenant démarrer sur le port **5000**.

2. **Redémarrer les apps** (si elles tournent) :
   ```bash
   # Admin
   cd apps/admin
   pnpm dev

   # Frontend (optionnel)
   cd apps/frontend
   pnpm dev
   ```

3. **Vérifier que tout fonctionne** :
   - Backend : http://localhost:5000/health
   - Admin : http://localhost:3001
   - Frontend : http://localhost:3000

## Notes

- Le port peut aussi être configuré via la variable d'environnement `PORT` dans un fichier `.env` du dossier `server/`
- En production sur Vercel, le port est géré automatiquement par Vercel
- Les URLs dans les fichiers `.env.local` ont été mises à jour automatiquement
