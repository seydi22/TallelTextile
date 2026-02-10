# ✅ Migration Monorepo - Complétée

## 📦 Structure Créée

```
TallelTextile/
├── apps/
│   ├── frontend/          # Site client (sans NextAuth)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── helpers/
│   │   └── public/
│   └── admin/             # Dashboard admin (avec NextAuth)
│       ├── app/
│       │   ├── (dashboard)/admin/
│       │   ├── api/auth/
│       │   └── login/
│       ├── components/
│       ├── lib/
│       └── utils/
├── packages/
│   ├── shared/            # Code partagé
│   │   └── lib/
│   └── prisma/            # Prisma partagé
│       └── schema.prisma
└── server/                # Backend (inchangé)
```

## ✅ Fichiers Copiés

### Frontend
- ✅ Tous les components (sauf Dashboard* et Admin*)
- ✅ app/ (sauf admin et api/auth)
- ✅ public/
- ✅ lib/ (sauf authOptions.ts et auth.ts)
- ✅ hooks/
- ✅ helpers/
- ✅ Config files (tailwind, postcss)

### Admin
- ✅ app/(dashboard)/admin/
- ✅ app/api/auth/
- ✅ app/login/
- ✅ Components admin uniquement (Dashboard*, Admin*)
- ✅ lib/authOptions.ts
- ✅ lib/auth.ts
- ✅ utils/adminAuth.ts
- ✅ utils/SessionProvider.tsx
- ✅ Config files

### Packages
- ✅ packages/shared/lib/ (config, api, utils, formatPrice)
- ✅ packages/prisma/schema.prisma

## 🔄 Prochaines Étapes

### 1. Installer les dépendances

```bash
# Installer pnpm si pas déjà fait
npm install -g pnpm

# Installer les dépendances
pnpm install

# Générer Prisma Client
pnpm --filter prisma generate
```

### 2. Mettre à jour les imports

Dans tous les fichiers copiés, remplacer progressivement :
- `import ... from '@/lib/config'` → `import ... from '@tallel-textile/shared/lib/config'`
- `import ... from '@/lib/api'` → `import ... from '@tallel-textile/shared/lib/api'`
- `import { PrismaClient } from '@prisma/client'` → `import { PrismaClient } from '@tallel-textile/prisma'`

### 3. Tester chaque app

```bash
# Frontend (port 3000)
pnpm run dev:frontend

# Admin (port 3001)
pnpm run dev:admin
```

### 4. Configurer Vercel

Créer deux projets Vercel :
- **Frontend** : Pointant vers `apps/frontend`
- **Admin** : Pointant vers `apps/admin`

## ⚠️ Notes Importantes

- Les fichiers originaux sont toujours à la racine
- Ne pas supprimer les fichiers originaux tant que tout fonctionne
- Tester chaque app après chaque modification
- Les imports doivent être mis à jour progressivement

## 📝 Fichiers à Vérifier

1. `apps/frontend/app/layout.tsx` - Vérifier qu'il n'y a pas de NextAuth
2. `apps/admin/app/layout.tsx` - Vérifier que NextAuth est présent
3. `apps/admin/lib/authOptions.ts` - Vérifier les imports
4. `apps/admin/utils/SessionProvider.tsx` - Vérifier les imports
