# 🏗️ Architecture Monorepo : Séparation Frontend/Admin

## 🎯 Objectif

Séparer complètement :
- **Frontend** : Site client (sans login, site public)
- **Admin** : Dashboard admin (avec NextAuth, authentification)

## 📁 Structure Proposée

```
TallelTextile/
├── apps/
│   ├── frontend/          # Site client (sans auth)
│   │   ├── app/
│   │   │   ├── (home)/    # Pages publiques
│   │   │   ├── shop/      # Boutique
│   │   │   ├── product/   # Produits
│   │   │   └── ...
│   │   ├── components/    # Composants frontend
│   │   ├── lib/           # Utilitaires frontend
│   │   └── package.json
│   │
│   └── admin/             # Dashboard admin (avec NextAuth)
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   └── admin/ # Toutes les pages admin
│       │   ├── api/
│       │   │   └── auth/  # NextAuth uniquement ici
│       │   └── login/     # Page de login admin
│       ├── components/    # Composants admin
│       ├── lib/
│       │   └── authOptions.ts  # Config NextAuth
│       └── package.json
│
├── packages/
│   ├── shared/            # Code partagé
│   │   ├── types/         # Types TypeScript partagés
│   │   ├── utils/         # Utilitaires partagés
│   │   └── package.json
│   │
│   └── prisma/            # Prisma partagé
│       ├── schema.prisma
│       └── package.json
│
├── server/                # Backend Express (partagé)
│   ├── app.js
│   ├── routes/
│   └── controllers/
│
├── package.json           # Root package.json (workspace)
└── pnpm-workspace.yaml    # ou npm/yarn workspaces
```

## ✅ Avantages

1. **Séparation complète** : Frontend et Admin sont des apps distinctes
2. **Pas de conflit NextAuth** : NextAuth uniquement dans l'app admin
3. **Backend partagé** : Un seul backend pour les deux apps
4. **Prisma partagé** : Une seule base de données
5. **Déploiement séparé** : Deux apps Vercel distinctes
6. **Développement indépendant** : Chaque app peut évoluer séparément

## 🔧 Configuration

### 1. Root `package.json` (Workspace)

```json
{
  "name": "tallel-textile-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:admin": "pnpm --filter admin dev",
    "dev:all": "pnpm run dev:frontend & pnpm run dev:admin",
    "build:frontend": "pnpm --filter frontend build",
    "build:admin": "pnpm --filter admin build"
  }
}
```

### 2. Frontend `apps/frontend/package.json`

```json
{
  "name": "@tallel-textile/frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.5.3",
    "react": "^18.3.1",
    "@tallel-textile/shared": "workspace:*",
    "@tallel-textile/prisma": "workspace:*"
  }
}
```

### 3. Admin `apps/admin/package.json`

```json
{
  "name": "@tallel-textile/admin",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.5.3",
    "next-auth": "^4.24.7",
    "react": "^18.3.1",
    "@tallel-textile/shared": "workspace:*",
    "@tallel-textile/prisma": "workspace:*"
  }
}
```

## 🚀 Déploiement Vercel

### Frontend
- **URL** : `https://tallel-textile.vercel.app`
- **Port** : 3000
- **Pas de NextAuth** ✅

### Admin
- **URL** : `https://admin.tallel-textile.vercel.app` (ou sous-domaine)
- **Port** : 3001
- **Avec NextAuth** ✅
- **Variables d'environnement** :
  - `NEXTAUTH_URL=https://admin.tallel-textile.vercel.app`
  - `NEXTAUTH_SECRET=...`
  - `NEXT_PUBLIC_API_BASE_URL=https://tallel-textile-j62y.vercel.app/api`

## 📝 Migration

### Étape 1 : Créer la structure

1. Créer `apps/frontend/` et déplacer le code frontend
2. Créer `apps/admin/` et déplacer le code admin
3. Créer `packages/shared/` pour le code partagé
4. Créer `packages/prisma/` pour Prisma

### Étape 2 : Déplacer les fichiers

**Frontend** :
- `app/` (sauf `(dashboard)/admin/`)
- `components/` (sauf composants admin)
- `lib/` (sauf `authOptions.ts`)

**Admin** :
- `app/(dashboard)/admin/` → `apps/admin/app/(dashboard)/admin/`
- `app/api/auth/` → `apps/admin/app/api/auth/`
- `app/login/` → `apps/admin/app/login/`
- `lib/authOptions.ts` → `apps/admin/lib/authOptions.ts`
- Composants admin

**Partagé** :
- `server/` (backend)
- `prisma/` → `packages/prisma/`
- Types partagés → `packages/shared/types/`

### Étape 3 : Configurer les workspaces

1. Installer pnpm (ou utiliser npm/yarn workspaces)
2. Configurer `pnpm-workspace.yaml`
3. Mettre à jour les `package.json`

## 🎯 Résultat Final

- ✅ **Frontend** : Site public, pas de NextAuth, simple et rapide
- ✅ **Admin** : Dashboard avec NextAuth, isolé et sécurisé
- ✅ **Backend** : Partagé entre les deux apps
- ✅ **Base de données** : Prisma partagé

## ⚠️ Points d'Attention

1. **Imports** : Utiliser les packages partagés (`@tallel-textile/shared`)
2. **Variables d'environnement** : Séparer pour chaque app
3. **Déploiement** : Deux projets Vercel distincts
4. **CORS** : Backend doit autoriser les deux origines
