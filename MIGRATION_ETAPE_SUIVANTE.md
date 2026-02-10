# 🚀 Migration Monorepo - Étape Suivante

## ✅ Ce qui a été fait

1. ✅ Structure de dossiers créée
2. ✅ Configuration workspace (package.json, pnpm-workspace.yaml)
3. ✅ Configuration TypeScript pour chaque app
4. ✅ Configuration Next.js pour chaque app
5. ✅ Packages partagés créés (shared, prisma)
6. ✅ Fichiers copiés (partiellement) :
   - Frontend : app/, public/, lib/, config files
   - Admin : app/(dashboard)/admin/, app/api/auth/, app/login/, lib/authOptions.ts
7. ✅ Layouts créés pour chaque app

## 🔄 Ce qui reste à faire

### 1. Copier les components

**Frontend** : Tous les components SAUF :
- `DashboardSidebar.tsx`
- `DashboardProductTable.tsx`
- `AdminOrders.tsx`
- `StatsElement.tsx`
- `BulkUploadHistory.tsx`
- `OrderItem.tsx`

**Admin** : Uniquement :
- `DashboardSidebar.tsx`
- `DashboardProductTable.tsx`
- `AdminOrders.tsx`
- `StatsElement.tsx`
- `BulkUploadHistory.tsx`
- `OrderItem.tsx`

### 2. Copier les autres fichiers

- `hooks/` → `apps/frontend/hooks/` (ou partagé si utilisé par admin)
- `helpers/` → `packages/shared/helpers/` ou apps appropriées
- `types/` → `packages/shared/types/` (déjà copié)
- `utils/` → Séparer entre frontend et admin

### 3. Mettre à jour les imports

Dans tous les fichiers copiés, remplacer :
- `import ... from '@/lib/config'` → `import ... from '@tallel-textile/shared/lib/config'`
- `import ... from '@/lib/api'` → `import ... from '@tallel-textile/shared/lib/api'`
- `import { PrismaClient } from '@prisma/client'` → `import { PrismaClient } from '@tallel-textile/prisma'`

### 4. Créer les fichiers index.ts

- `apps/frontend/components/index.ts` (sans les components admin)
- `apps/admin/components/index.ts` (uniquement les components admin)

### 5. Installer et tester

```bash
# Installer pnpm si pas déjà fait
npm install -g pnpm

# Installer les dépendances
pnpm install

# Générer Prisma Client
pnpm --filter prisma generate

# Tester frontend
pnpm run dev:frontend  # Port 3000

# Tester admin
pnpm run dev:admin     # Port 3001
```

## 📝 Notes Importantes

- Les fichiers originaux sont toujours à la racine
- Ne pas supprimer les fichiers originaux tant que la migration n'est pas complète
- Tester chaque app après chaque étape
- Les imports doivent être mis à jour progressivement

## 🎯 Prochaine Action Immédiate

**Copier les components** vers les bonnes apps, puis mettre à jour les imports.
