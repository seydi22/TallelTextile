# ✅ Checklist de Déploiement Vercel - Monorepo Tallel Textile

## 📋 Préparation

### 1. Vérifications préalables
- [ ] Le code est poussé sur GitHub
- [ ] Tous les tests passent localement
- [ ] Les builds fonctionnent : `pnpm build:frontend` et `pnpm build:admin`
- [ ] Le backend démarre correctement : `cd server && node app.js`

### 2. Variables d'environnement à préparer

#### Backend
```
DATABASE_URL=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
NODE_ENV=production
FRONTEND_URL=https://tallel-textile.vercel.app
ADMIN_URL=https://admin.tallel-textile.vercel.app
```

#### Frontend
```
NEXT_PUBLIC_API_BASE_URL=https://api.tallel-textile.vercel.app/api
NODE_ENV=production
```

#### Admin
```
NEXT_PUBLIC_API_BASE_URL=https://api.tallel-textile.vercel.app/api
NODE_ENV=production
```

---

## 🚀 Déploiement Backend

### Étape 1 : Créer le projet Backend
1. [ ] Aller sur [vercel.com](https://vercel.com)
2. [ ] Cliquer sur **Add New Project**
3. [ ] Importer le repository GitHub
4. [ ] Configurer :
   - **Framework Preset** : Other
   - **Root Directory** : `server`
   - **Build Command** : (laisser vide)
   - **Output Directory** : (laisser vide)
   - **Install Command** : `cd server && npm install`

### Étape 2 : Configurer les variables
- [ ] Ajouter toutes les variables d'environnement backend
- [ ] Vérifier que `FRONTEND_URL` et `ADMIN_URL` sont définis

### Étape 3 : Déployer
- [ ] Cliquer sur **Deploy**
- [ ] Noter l'URL générée (ex: `https://api.tallel-textile.vercel.app`)

---

## 🌐 Déploiement Frontend

### Étape 1 : Créer le projet Frontend
1. [ ] **Add New Project** sur Vercel
2. [ ] Importer le même repository
3. [ ] Configurer :
   - **Framework Preset** : Next.js
   - **Root Directory** : `apps/frontend`
   - **Build Command** : `cd ../.. && pnpm install && cd apps/frontend && pnpm build`
   - **Output Directory** : `.next`
   - **Install Command** : `cd ../.. && pnpm install`

### Étape 2 : Configurer les variables
- [ ] `NEXT_PUBLIC_API_BASE_URL` = URL du backend (ex: `https://api.tallel-textile.vercel.app/api`)

### Étape 3 : Déployer
- [ ] Cliquer sur **Deploy**
- [ ] Noter l'URL générée

---

## 🔐 Déploiement Admin

### Étape 1 : Créer le projet Admin
1. [ ] **Add New Project** sur Vercel
2. [ ] Importer le même repository
3. [ ] Configurer :
   - **Framework Preset** : Next.js
   - **Root Directory** : `apps/admin`
   - **Build Command** : `cd ../.. && pnpm install && cd apps/admin && pnpm build`
   - **Output Directory** : `.next`
   - **Install Command** : `cd ../.. && pnpm install`

### Étape 2 : Configurer les variables
- [ ] `NEXT_PUBLIC_API_BASE_URL` = URL du backend (ex: `https://api.tallel-textile.vercel.app/api`)

### Étape 3 : Déployer
- [ ] Cliquer sur **Deploy**
- [ ] Noter l'URL générée

---

## 🔗 Mise à jour des URLs

### Après le premier déploiement
1. [ ] Noter les 3 URLs Vercel :
   - Backend : `https://api.tallel-textile.vercel.app`
   - Frontend : `https://tallel-textile.vercel.app`
   - Admin : `https://admin.tallel-textile.vercel.app`

2. [ ] Mettre à jour les variables d'environnement :
   - Backend : `FRONTEND_URL` et `ADMIN_URL`
   - Frontend : `NEXT_PUBLIC_API_BASE_URL`
   - Admin : `NEXT_PUBLIC_API_BASE_URL`

3. [ ] Redéployer chaque projet après mise à jour des variables

---

## 🧪 Tests Post-Déploiement

### Backend
- [ ] `/health` répond avec status 200
- [ ] `/api/test` répond avec status 200
- [ ] `/api/categories` retourne les catégories

### Frontend
- [ ] Page d'accueil charge correctement
- [ ] Les images s'affichent
- [ ] Les catégories se chargent
- [ ] Le panier fonctionne

### Admin
- [ ] Page de login s'affiche
- [ ] Connexion fonctionne
- [ ] Dashboard s'affiche après connexion
- [ ] Les produits s'affichent

### Intégration
- [ ] Frontend peut appeler le backend
- [ ] Admin peut appeler le backend
- [ ] Les images Cloudinary s'affichent
- [ ] Les uploads fonctionnent

---

## 🐛 Dépannage

### Erreur de build
- [ ] Vérifier les logs dans Vercel
- [ ] Tester le build localement
- [ ] Vérifier que toutes les dépendances sont dans `package.json`

### Erreur CORS
- [ ] Vérifier que `FRONTEND_URL` et `ADMIN_URL` sont corrects dans le backend
- [ ] Vérifier la configuration CORS dans `server/app.js`

### Erreur "Module not found"
- [ ] Vérifier que `pnpm-workspace.yaml` est correct
- [ ] Vérifier que les packages workspace sont bien configurés

### Images ne s'affichent pas
- [ ] Vérifier que Cloudinary est configuré
- [ ] Vérifier que `next.config.mjs` autorise `res.cloudinary.com`

---

## 📝 Notes importantes

1. **Monorepo** : Chaque application doit être un projet Vercel séparé
2. **Root Directory** : Important de spécifier le bon répertoire pour chaque projet
3. **Build Command** : Doit inclure `pnpm install` à la racine pour installer les workspaces
4. **Variables d'environnement** : Doivent être ajoutées dans chaque projet Vercel

---

## 🎯 URLs finales attendues

- **Frontend** : `https://tallel-textile.vercel.app`
- **Admin** : `https://admin.tallel-textile.vercel.app` (ou sous-domaine personnalisé)
- **Backend** : `https://api.tallel-textile.vercel.app` (ou sous-domaine personnalisé)
