# 🚀 Guide de Déploiement Vercel - Tallel Textile

## 📦 Architecture Monorepo

Votre projet est organisé en monorepo avec 3 applications :

```
TallelTextile/
├── apps/
│   ├── frontend/     # Application publique Next.js
│   └── admin/        # Dashboard admin Next.js
├── server/           # API Backend Express.js
└── packages/
    ├── shared/       # Code partagé
    └── prisma/       # Client Prisma
```

## 🎯 Stratégie de Déploiement

**Recommandation : 3 projets Vercel séparés**

Chaque application sera déployée comme un projet Vercel indépendant pour une meilleure isolation et gestion.

---

## 📋 Étape 1 : Préparation

### 1.1 Vérifier que tout fonctionne localement

```bash
# Backend
cd server && npm install && node app.js

# Frontend
pnpm dev:frontend

# Admin
pnpm dev:admin
```

### 1.2 Tester les builds

```bash
# Frontend
cd apps/frontend && pnpm build

# Admin
cd apps/admin && pnpm build
```

---

## 🔧 Étape 2 : Déploiement Backend

### 2.1 Créer le projet sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. **Add New Project**
3. Importez votre repository GitHub
4. Configuration :
   - **Framework Preset** : `Other`
   - **Root Directory** : `server`
   - **Build Command** : (laisser vide)
   - **Output Directory** : (laisser vide)
   - **Install Command** : `cd server && npm install`

### 2.2 Variables d'environnement Backend

Dans **Settings → Environment Variables**, ajoutez :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `DATABASE_URL` | `mongodb+srv://...` | Production, Preview, Development |
| `CLOUDINARY_CLOUD_NAME` | Votre cloud name | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | Votre API key | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | Votre API secret | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://tallel-textile.vercel.app` | Production, Preview |
| `ADMIN_URL` | `https://admin.tallel-textile.vercel.app` | Production, Preview |

### 2.3 Déployer

Cliquez sur **Deploy** et notez l'URL générée (ex: `https://api.tallel-textile.vercel.app`)

---

## 🌐 Étape 3 : Déploiement Frontend

### 3.1 Créer le projet sur Vercel

1. **Add New Project** sur Vercel
2. Importez le même repository
3. Configuration :
   - **Framework Preset** : `Next.js`
   - **Root Directory** : `apps/frontend`
   - **Build Command** : `cd ../.. && pnpm install && cd apps/frontend && pnpm build`
   - **Output Directory** : `.next`
   - **Install Command** : `cd ../.. && pnpm install`

### 3.2 Variables d'environnement Frontend

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.tallel-textile.vercel.app/api` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### 3.3 Déployer

Cliquez sur **Deploy** et notez l'URL générée (ex: `https://tallel-textile.vercel.app`)

---

## 🔐 Étape 4 : Déploiement Admin

### 4.1 Créer le projet sur Vercel

1. **Add New Project** sur Vercel
2. Importez le même repository
3. Configuration :
   - **Framework Preset** : `Next.js`
   - **Root Directory** : `apps/admin`
   - **Build Command** : `cd ../.. && pnpm install && cd apps/admin && pnpm build`
   - **Output Directory** : `.next`
   - **Install Command** : `cd ../.. && pnpm install`

### 4.2 Variables d'environnement Admin

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.tallel-textile.vercel.app/api` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### 4.3 Déployer

Cliquez sur **Deploy** et notez l'URL générée (ex: `https://admin.tallel-textile.vercel.app`)

---

## 🔄 Étape 5 : Mise à jour des URLs

Après le premier déploiement, vous devez mettre à jour les variables d'environnement :

1. **Backend** : Mettre à jour `FRONTEND_URL` et `ADMIN_URL` avec les URLs réelles
2. **Frontend** : Mettre à jour `NEXT_PUBLIC_API_BASE_URL` avec l'URL du backend
3. **Admin** : Mettre à jour `NEXT_PUBLIC_API_BASE_URL` avec l'URL du backend
4. **Redéployer** chaque projet après les mises à jour

---

## ✅ Checklist de Vérification

### Backend
- [ ] `/health` répond avec status 200
- [ ] `/api/test` répond avec status 200
- [ ] `/api/categories` retourne les catégories
- [ ] CORS fonctionne (pas d'erreur CORS dans la console)

### Frontend
- [ ] Page d'accueil charge
- [ ] Les catégories s'affichent
- [ ] Les produits s'affichent
- [ ] Le panier fonctionne
- [ ] Les images Cloudinary s'affichent

### Admin
- [ ] Page de login s'affiche
- [ ] Connexion fonctionne
- [ ] Dashboard s'affiche
- [ ] Les produits s'affichent
- [ ] Upload d'images fonctionne

---

## 🐛 Dépannage

### Erreur de build
- Vérifiez les logs dans Vercel
- Testez le build localement
- Vérifiez que toutes les dépendances sont dans les `package.json`

### Erreur CORS
- Vérifiez que `FRONTEND_URL` et `ADMIN_URL` sont corrects dans le backend
- Vérifiez que les URLs correspondent exactement

### Erreur "Module not found"
- Vérifiez que `pnpm-workspace.yaml` est correct
- Vérifiez que les packages workspace sont bien configurés

---

## 📚 Fichiers de Configuration Créés

- ✅ `apps/frontend/vercel.json` - Configuration Vercel pour le frontend
- ✅ `apps/admin/vercel.json` - Configuration Vercel pour l'admin
- ✅ `server/vercel.json` - Configuration Vercel pour le backend (mis à jour)
- ✅ `GUIDE_DEPLOIEMENT_MONOREPO.md` - Guide détaillé
- ✅ `DEPLOIEMENT_VERCEL_CHECKLIST.md` - Checklist complète

---

## 🎯 URLs Finales

Après déploiement, vous aurez :
- **Frontend** : `https://tallel-textile.vercel.app`
- **Admin** : `https://admin.tallel-textile.vercel.app` (ou sous-domaine personnalisé)
- **Backend** : `https://api.tallel-textile.vercel.app` (ou sous-domaine personnalisé)

---

## 💡 Conseils

1. **Déployez d'abord le backend** pour obtenir son URL
2. **Ensuite le frontend et l'admin** avec l'URL du backend
3. **Mettez à jour les variables** après chaque déploiement
4. **Testez chaque étape** avant de passer à la suivante

Bon déploiement ! 🚀
