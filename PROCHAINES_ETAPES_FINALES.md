# 🎯 Prochaines Étapes Finales

## ✅ Ce qui est fait

1. ✅ Structure monorepo créée
2. ✅ Fichiers copiés vers les bonnes apps
3. ✅ Imports critiques mis à jour
4. ✅ Packages partagés configurés

## 🔄 Étapes Finales

### 1. Installer les dépendances

```bash
# Installer pnpm si pas déjà fait
npm install -g pnpm

# Installer toutes les dépendances
pnpm install

# Générer Prisma Client
pnpm --filter prisma generate
```

### 2. Mettre à jour les imports restants

Les fichiers suivants doivent encore être mis à jour :
- Components frontend qui utilisent `@/lib/*`
- Pages app qui utilisent `@/lib/*`

**Option 1 : Automatique (recommandé)**
```bash
# Utiliser un outil de recherche/remplacement dans votre IDE
# Remplacer dans apps/frontend :
#   @/lib/config → @tallel-textile/shared/lib/config
#   @/lib/api → @tallel-textile/shared/lib/api
#   @/lib/utils → @tallel-textile/shared/lib/utils
#   @/lib/formatPrice → @tallel-textile/shared/lib/formatPrice
```

**Option 2 : Manuel**
Mettre à jour fichier par fichier selon les erreurs de build.

### 3. Tester chaque app

```bash
# Terminal 1 : Frontend
cd apps/frontend
pnpm dev

# Terminal 2 : Admin
cd apps/admin
pnpm dev

# Terminal 3 : Backend (si nécessaire)
cd server
node app.js
```

### 4. Corriger les erreurs

- Erreurs d'imports → Mettre à jour les imports
- Erreurs TypeScript → Vérifier les types
- Erreurs de build → Vérifier les configurations

### 5. Configurer Vercel

Créer deux projets Vercel distincts :
- **Frontend** : Root directory = `apps/frontend`
- **Admin** : Root directory = `apps/admin`

Variables d'environnement pour chaque projet :
- Frontend : `NEXT_PUBLIC_API_BASE_URL`
- Admin : `NEXT_PUBLIC_API_BASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

## 📝 Checklist Finale

- [ ] `pnpm install` exécuté
- [ ] `pnpm --filter prisma generate` exécuté
- [ ] Tous les imports mis à jour
- [ ] Frontend démarre sans erreurs
- [ ] Admin démarre sans erreurs
- [ ] Backend fonctionne avec les deux apps
- [ ] Tests de connexion admin fonctionnent
- [ ] Vercel configuré pour les deux apps

## 🎉 Une fois terminé

Vous aurez :
- ✅ Frontend séparé (sans NextAuth)
- ✅ Admin séparé (avec NextAuth)
- ✅ Code partagé dans packages/
- ✅ Backend commun
- ✅ Déploiements indépendants
