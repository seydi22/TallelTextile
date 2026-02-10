# 🚀 Guide de Déploiement - Monorepo Tallel Textile

Ce guide vous accompagne pour déployer votre monorepo sur Vercel avec 3 applications séparées :
- **Frontend** : Application publique Next.js
- **Admin** : Dashboard d'administration Next.js
- **Backend** : API Express.js

## 📋 Architecture de Déploiement

```
┌─────────────────────────────────────────┐
│         Vercel Projects                 │
├─────────────────────────────────────────┤
│ 1. Frontend (apps/frontend)            │
│    → https://tallel-textile.vercel.app │
├─────────────────────────────────────────┤
│ 2. Admin (apps/admin)                  │
│    → https://admin.tallel-textile.vercel.app │
├─────────────────────────────────────────┤
│ 3. Backend (server/)                    │
│    → https://api.tallel-textile.vercel.app │
└─────────────────────────────────────────┘
```

## 🔧 Étape 1 : Préparation des Projets Vercel

### Option A : 3 Projets Vercel Séparés (Recommandé)

Chaque application sera déployée comme un projet Vercel indépendant.

### Option B : 1 Projet avec Monorepo (Avancé)

Un seul projet Vercel avec configuration monorepo.

---

## 📦 Étape 2 : Déploiement du Backend

### 2.1 Créer le projet Backend sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **Add New Project**
3. Importez votre repository GitHub
4. Configurez le projet :
   - **Framework Preset** : Other
   - **Root Directory** : `server`
   - **Build Command** : (laissez vide ou `npm install`)
   - **Output Directory** : (laissez vide)
   - **Install Command** : `cd server && npm install`

### 2.2 Configuration Backend (`server/vercel.json`)

Le fichier `server/vercel.json` doit contenir :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/app.js"
    }
  ]
}
```

### 2.3 Variables d'environnement Backend

Dans Vercel → Settings → Environment Variables, ajoutez :

```
DATABASE_URL=votre-connection-string-mongodb
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
FRONTEND_URL=https://tallel-textile.vercel.app
```

### 2.4 Modifier `server/app.js` pour Vercel

À la fin de `server/app.js`, ajoutez :

```javascript
// Export pour Vercel Serverless Functions
module.exports = app;

// Démarrer le serveur seulement si exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
```

---

## 🌐 Étape 3 : Déploiement du Frontend

### 3.1 Créer le projet Frontend sur Vercel

1. **Add New Project** sur Vercel
2. Importez le même repository
3. Configurez :
   - **Framework Preset** : Next.js
   - **Root Directory** : `apps/frontend`
   - **Build Command** : `cd apps/frontend && pnpm install && pnpm build`
   - **Output Directory** : `.next`
   - **Install Command** : `pnpm install`

### 3.2 Variables d'environnement Frontend

```
NEXT_PUBLIC_API_BASE_URL=https://api.tallel-textile.vercel.app/api
NODE_ENV=production
```

### 3.3 Configuration Frontend (`apps/frontend/vercel.json`)

Créez `apps/frontend/vercel.json` :

```json
{
  "buildCommand": "pnpm install && pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 🔐 Étape 4 : Déploiement de l'Admin

### 4.1 Créer le projet Admin sur Vercel

1. **Add New Project** sur Vercel
2. Importez le même repository
3. Configurez :
   - **Framework Preset** : Next.js
   - **Root Directory** : `apps/admin`
   - **Build Command** : `cd apps/admin && pnpm install && pnpm build`
   - **Output Directory** : `.next`
   - **Install Command** : `pnpm install`

### 4.2 Variables d'environnement Admin

```
NEXT_PUBLIC_API_BASE_URL=https://api.tallel-textile.vercel.app/api
NODE_ENV=production
```

### 4.3 Configuration Admin (`apps/admin/vercel.json`)

Créez `apps/admin/vercel.json` :

```json
{
  "buildCommand": "pnpm install && pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 🔗 Étape 5 : Configuration CORS Backend

Modifiez `server/app.js` pour autoriser les domaines frontend et admin :

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://tallel-textile.vercel.app',
  'https://admin.tallel-textile.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

---

## 📝 Étape 6 : Checklist de Déploiement

### Backend
- [ ] Projet Vercel créé avec root directory `server`
- [ ] `server/vercel.json` configuré
- [ ] Variables d'environnement ajoutées
- [ ] `server/app.js` exporte l'app pour Vercel
- [ ] CORS configuré avec les URLs frontend/admin
- [ ] Test de déploiement réussi

### Frontend
- [ ] Projet Vercel créé avec root directory `apps/frontend`
- [ ] `apps/frontend/vercel.json` créé
- [ ] Variable `NEXT_PUBLIC_API_BASE_URL` pointant vers le backend
- [ ] Build testé localement
- [ ] Déploiement réussi

### Admin
- [ ] Projet Vercel créé avec root directory `apps/admin`
- [ ] `apps/admin/vercel.json` créé
- [ ] Variable `NEXT_PUBLIC_API_BASE_URL` pointant vers le backend
- [ ] Build testé localement
- [ ] Déploiement réussi

---

## 🧪 Étape 7 : Tests Post-Déploiement

1. **Backend** : Vérifier que `/api/categories` répond
2. **Frontend** : Vérifier que la page d'accueil charge
3. **Admin** : Vérifier que la page de login fonctionne
4. **Intégration** : Vérifier que le frontend peut appeler le backend

---

## 🐛 Dépannage

### Erreur : "Module not found"
- Vérifiez que les `package.json` ont toutes les dépendances
- Vérifiez que `pnpm-workspace.yaml` est correct

### Erreur : "Build failed"
- Vérifiez les logs de build dans Vercel
- Testez le build localement : `cd apps/frontend && pnpm build`

### Erreur : "CORS error"
- Vérifiez que les URLs sont correctes dans `server/app.js`
- Vérifiez que `FRONTEND_URL` et `ADMIN_URL` sont définis

---

## 📚 Ressources

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
