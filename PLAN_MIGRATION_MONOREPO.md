# 📋 Plan de Migration : Monorepo Frontend/Admin

## 🎯 Objectif

Séparer le frontend et l'admin en deux apps Next.js distinctes dans le même repo.

## 📝 Étapes de Migration

### Phase 1 : Préparation (30 min)

1. ✅ Créer la structure de dossiers
2. ✅ Installer pnpm (ou utiliser npm workspaces)
3. ✅ Configurer le workspace root

### Phase 2 : Créer l'app Frontend (1h)

1. Créer `apps/frontend/`
2. Déplacer les fichiers frontend :
   - `app/` (sauf `(dashboard)/admin/`)
   - `components/` (sauf admin)
   - `lib/` (sauf `authOptions.ts`)
   - `public/`
   - `styles/`
3. Créer `apps/frontend/package.json`
4. Créer `apps/frontend/next.config.mjs`
5. Créer `apps/frontend/tsconfig.json`

### Phase 3 : Créer l'app Admin (1h)

1. Créer `apps/admin/`
2. Déplacer les fichiers admin :
   - `app/(dashboard)/admin/` → `apps/admin/app/(dashboard)/admin/`
   - `app/api/auth/` → `apps/admin/app/api/auth/`
   - `app/login/` → `apps/admin/app/login/`
   - `lib/authOptions.ts` → `apps/admin/lib/authOptions.ts`
   - Composants admin
3. Créer `apps/admin/package.json`
4. Créer `apps/admin/next.config.mjs`
5. Créer `apps/admin/tsconfig.json`

### Phase 4 : Créer les packages partagés (30 min)

1. Créer `packages/shared/`
   - Types partagés
   - Utilitaires partagés
2. Créer `packages/prisma/`
   - Déplacer `prisma/` ici
   - Configurer pour être utilisé par les deux apps

### Phase 5 : Mettre à jour les imports (1h)

1. Mettre à jour les imports dans frontend
2. Mettre à jour les imports dans admin
3. Utiliser `@tallel-textile/shared` et `@tallel-textile/prisma`

### Phase 6 : Configuration Vercel (30 min)

1. Créer un nouveau projet Vercel pour l'admin
2. Configurer les variables d'environnement
3. Configurer les déploiements

## 🚀 Commandes de Migration

```bash
# 1. Installer pnpm
npm install -g pnpm

# 2. Créer la structure
mkdir -p apps/frontend apps/admin packages/shared packages/prisma

# 3. Initialiser les workspaces
pnpm init

# 4. Installer les dépendances
pnpm install

# 5. Démarrer les apps
pnpm run dev:frontend  # Port 3000
pnpm run dev:admin     # Port 3001
```

## 📁 Fichiers à Déplacer

### Vers `apps/frontend/` :
- `app/` (sauf `(dashboard)/admin/`)
- `components/` (sauf `Dashboard*`, `Admin*`)
- `lib/` (sauf `authOptions.ts`)
- `public/`
- `styles/`
- `tailwind.config.ts`
- `postcss.config.js`

### Vers `apps/admin/` :
- `app/(dashboard)/admin/`
- `app/api/auth/`
- `app/login/`
- `lib/authOptions.ts`
- `components/Dashboard*.tsx`
- `components/Admin*.tsx`
- `utils/adminAuth.ts`
- `utils/SessionProvider.tsx`

### Vers `packages/shared/` :
- `types/` (types partagés)
- `helpers/` (si partagés)
- Utilitaires partagés

### Vers `packages/prisma/` :
- `prisma/` (tout le dossier)

### Reste à la racine :
- `server/` (backend)
- `vercel.json` (pour le backend)

## ⚠️ Points d'Attention

1. **Imports relatifs** : Convertir en imports de packages
2. **Variables d'environnement** : Séparer pour chaque app
3. **CORS Backend** : Autoriser les deux origines
4. **Prisma** : Générer le client dans chaque app

## ✅ Checklist

- [ ] Structure de dossiers créée
- [ ] Workspace configuré
- [ ] App frontend créée et fonctionnelle
- [ ] App admin créée et fonctionnelle
- [ ] Packages partagés créés
- [ ] Imports mis à jour
- [ ] Tests locaux OK
- [ ] Déploiement Vercel configuré
- [ ] Variables d'environnement configurées
