# ⚡ Action Immédiate : Résoudre Module Not Found

## 🔴 Problème

```
Module not found: Can't resolve '@tallel-textile/shared/lib/api'
```

## ✅ Solutions Appliquées

1. ✅ Ajout de `exports` dans `packages/shared/package.json`
2. ✅ Ajout de `transpilePackages` dans `next.config.mjs` des apps
3. ✅ Mise à jour des `tsconfig.json` avec wildcards

## 🚀 Action Requise : Installer les Dépendances

**Vous devez installer les dépendances avec pnpm** :

```bash
# À la racine du projet
pnpm install
```

Cette commande va :
- ✅ Créer les liens symboliques entre les packages workspace
- ✅ Installer toutes les dépendances
- ✅ Résoudre les imports `@tallel-textile/shared`

## 📝 Après l'Installation

1. **Générer Prisma Client** :
   ```bash
   pnpm --filter prisma generate
   ```

2. **Redémarrer le serveur** :
   ```bash
   cd apps/admin
   pnpm dev
   ```

## ⚠️ Important

- **Ne pas utiliser `npm install`** - Utiliser **pnpm** pour les workspaces
- Les packages workspace nécessitent pnpm pour créer les liens symboliques
- Après `pnpm install`, les imports `@tallel-textile/shared/*` fonctionneront

## 🔍 Vérification

Après `pnpm install`, vérifier que les packages existent :

```bash
ls node_modules/@tallel-textile/
```

Vous devriez voir :
- `shared/`
- `prisma/`

Si ces dossiers n'existent pas, `pnpm install` n'a pas été exécuté ou a échoué.
