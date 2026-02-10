# 🔧 Solution : Module not found '@tallel-textile/shared/lib/api'

## Problème

```
Module not found: Can't resolve '@tallel-textile/shared/lib/api'
```

## Cause

Next.js ne peut pas résoudre les imports depuis les packages workspace sans configuration appropriée.

## Solutions Appliquées

### 1. Configuration du Package Shared

Ajout de `exports` dans `packages/shared/package.json` pour permettre les imports directs :
```json
"exports": {
  ".": "./index.ts",
  "./lib/api": "./lib/api.ts",
  "./lib/config": "./lib/config.ts",
  "./lib/utils": "./lib/utils.ts",
  "./lib/formatPrice": "./lib/formatPrice.ts",
  "./types": "./types/index.ts",
  "./types/*": "./types/*.ts"
}
```

### 2. Configuration TypeScript

Mise à jour des `tsconfig.json` pour inclure les wildcards :
```json
"paths": {
  "@tallel-textile/shared": ["../../packages/shared"],
  "@tallel-textile/shared/*": ["../../packages/shared/*"],
  "@tallel-textile/prisma": ["../../packages/prisma"],
  "@tallel-textile/prisma/*": ["../../packages/prisma/*"]
}
```

## Prochaines Étapes

### 1. Installer les Dépendances (si pas déjà fait)

```bash
# À la racine du projet
pnpm install
```

### 2. Redémarrer le Serveur de Développement

```bash
cd apps/admin
pnpm dev
```

### 3. Si le Problème Persiste

Vérifier que :
- ✅ `pnpm install` a été exécuté à la racine
- ✅ Les packages sont dans `node_modules/@tallel-textile/`
- ✅ Le serveur a été redémarré après les modifications

## Alternative : Imports Relatifs

Si les imports workspace ne fonctionnent toujours pas, vous pouvez utiliser des imports relatifs temporairement :

```typescript
// Au lieu de :
import apiClient from '@tallel-textile/shared/lib/api';

// Utiliser :
import apiClient from '../../../packages/shared/lib/api';
```

Mais les imports workspace devraient fonctionner après `pnpm install`.
