# 📦 Installation des Dépendances du Monorepo

## ⚠️ Important

Pour que les packages workspace (`@tallel-textile/shared`, `@tallel-textile/prisma`) fonctionnent, vous devez installer les dépendances avec **pnpm**.

## Installation

### 1. Installer pnpm (si pas déjà fait)

```bash
npm install -g pnpm
```

### 2. Installer toutes les dépendances

**À la racine du projet** :

```bash
# Se placer à la racine
cd C:\Users\hp\Desktop\Talel Textile\template\TallelTextile

# Installer toutes les dépendances (workspace + apps)
pnpm install
```

Cette commande va :
- ✅ Installer les dépendances de tous les packages
- ✅ Créer les liens symboliques entre les packages workspace
- ✅ Résoudre les dépendances partagées

### 3. Générer Prisma Client

```bash
pnpm --filter prisma generate
```

### 4. Vérifier l'Installation

Vérifier que les packages sont bien liés :

```bash
# Vérifier que les packages existent
ls node_modules/@tallel-textile/
```

Vous devriez voir :
- `shared/`
- `prisma/`

## Si l'Erreur Persiste

### Option 1 : Réinstaller

```bash
# Supprimer node_modules et lock file
Remove-Item -Recurse -Force node_modules
Remove-Item -Force pnpm-lock.yaml

# Réinstaller
pnpm install
```

### Option 2 : Vérifier la Configuration

Vérifier que `pnpm-workspace.yaml` contient :
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Option 3 : Build Manuel

```bash
# Build le package shared
cd packages/shared
pnpm install
cd ../..

# Build le package prisma
cd packages/prisma
pnpm install
pnpm generate
cd ../..

# Installer à la racine
pnpm install
```

## Après l'Installation

Redémarrer le serveur de développement :

```bash
cd apps/admin
pnpm dev
```

L'erreur `Module not found` devrait disparaître ! 🎉
