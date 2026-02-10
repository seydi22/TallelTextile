# 📝 Guide Rapide - Variables d'Environnement

## ⚡ Démarrage Rapide

### 1. Créer les fichiers `.env.local`

**Pour l'app Admin** (`apps/admin/.env.local`) :
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-key-change-in-production
BACKEND_URL=http://localhost:3001
```

**Pour l'app Frontend** (`apps/frontend/.env.local`) :
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### 2. Redémarrer les serveurs

```bash
# Terminal 1 : Backend
cd server
node app.js

# Terminal 2 : Admin
cd apps/admin
pnpm dev

# Terminal 3 : Frontend (optionnel)
cd apps/frontend
pnpm dev
```

### 3. Accéder aux apps

- **Admin** : http://localhost:3001
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001/api

## ⚠️ Notes Importantes

- Le fichier `.env.local` est dans `.gitignore` et ne sera pas commité
- En production, configurez ces variables dans Vercel
- Le warning `DEBUG_ENABLED` est normal en développement
- Le 404 sur `localhost:3001/` est normal (le backend n'a pas de route racine)
