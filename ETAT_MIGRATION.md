# 📊 État de la Migration Monorepo

## ✅ Complété

1. ✅ Structure de dossiers créée
   - `apps/frontend/`
   - `apps/admin/`
   - `packages/shared/`
   - `packages/prisma/`

2. ✅ Configuration workspace
   - `package.json` root avec workspaces
   - `pnpm-workspace.yaml`
   - `package.json` pour chaque app/package

3. ✅ Configuration TypeScript
   - `tsconfig.json` pour chaque app
   - `tsconfig.json` pour packages

4. ✅ Configuration Next.js
   - `next.config.mjs` pour frontend
   - `next.config.mjs` pour admin

5. ✅ Packages partagés créés
   - `packages/shared/lib/config.ts`
   - `packages/shared/lib/api.ts`
   - `packages/shared/lib/utils.ts`
   - `packages/shared/lib/formatPrice.ts`
   - `packages/shared/index.ts`
   - `packages/prisma/schema.prisma` (copié)
   - `packages/prisma/client.ts`
   - `packages/prisma/index.ts`

## 🔄 En Cours

### Prochaine Étape : Déplacer les fichiers

#### 1. Déplacer vers `apps/frontend/` :
- `app/` (sauf `(dashboard)/admin/` et `api/auth/`)
- `components/` (sauf `Dashboard*`, `Admin*`)
- `public/`
- `app/globals.css`
- `tailwind.config.ts`
- `postcss.config.js`
- `lib/` (sauf `authOptions.ts`, `auth.ts`)

#### 2. Déplacer vers `apps/admin/` :
- `app/(dashboard)/admin/` → `apps/admin/app/(dashboard)/admin/`
- `app/api/auth/` → `apps/admin/app/api/auth/`
- `app/login/` → `apps/admin/app/login/`
- `lib/authOptions.ts` → `apps/admin/lib/authOptions.ts`
- `lib/auth.ts` → `apps/admin/lib/auth.ts`
- `components/Dashboard*.tsx`
- `components/Admin*.tsx`
- `utils/adminAuth.ts`
- `utils/SessionProvider.tsx`

#### 3. Déplacer vers `packages/shared/` :
- `types/` (déjà copié)
- Autres utilitaires partagés

#### 4. Reste à la racine :
- `server/` (backend)
- `vercel.json` (pour backend)

## 📝 Commandes à Exécuter

```bash
# Installer pnpm si pas déjà fait
npm install -g pnpm

# Installer les dépendances
pnpm install

# Générer Prisma Client
pnpm --filter prisma generate

# Démarrer les apps
pnpm run dev:frontend  # Port 3000
pnpm run dev:admin     # Port 3001
```

## ⚠️ Points d'Attention

1. **Imports** : Mettre à jour tous les imports pour utiliser `@tallel-textile/shared` et `@tallel-textile/prisma`
2. **Variables d'environnement** : Séparer pour chaque app
3. **CORS Backend** : Autoriser les deux origines (frontend et admin)
4. **Déploiement Vercel** : Deux projets distincts

## 🎯 Prochaines Actions

1. Déplacer les fichiers vers les apps
2. Mettre à jour les imports
3. Tester chaque app
4. Configurer Vercel
