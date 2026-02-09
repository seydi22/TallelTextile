# Correction du problème NEXTAUTH_URL

## Problème identifié

NextAuth essaie d'accéder à `https://tallel-textile.vercel.app/api/auth/providers` au lieu de `https://tallel-textile-j62y.vercel.app/api/auth/providers`, ce qui cause une erreur 404.

## Cause

La variable d'environnement `NEXTAUTH_URL` dans Vercel est probablement définie avec une URL incorrecte (`https://tallel-textile.vercel.app` au lieu de `https://tallel-textile-j62y.vercel.app`).

## Solution

### Option 1 : Mettre à jour NEXTAUTH_URL dans Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Trouvez la variable `NEXTAUTH_URL`
5. Mettez à jour sa valeur avec l'URL correcte : `https://tallel-textile-j62y.vercel.app`
6. Redéployez l'application

### Option 2 : Supprimer NEXTAUTH_URL (Alternative)

Si vous supprimez complètement `NEXTAUTH_URL` de Vercel, NextAuth utilisera automatiquement l'URL de la requête actuelle, ce qui fonctionne mieux avec les URLs dynamiques de Vercel.

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Supprimez la variable `NEXTAUTH_URL`
5. Redéployez l'application

## Note importante

- `NEXTAUTH_SECRET` doit toujours être défini
- `NEXTAUTH_URL` est optionnel et peut être omis pour que NextAuth détecte automatiquement l'URL
- Après avoir modifié les variables d'environnement, vous devez redéployer l'application

## Vérification

Après avoir appliqué la correction, vérifiez que :
1. L'erreur 404 sur `/api/auth/providers` a disparu
2. La connexion fonctionne correctement
3. Les appels NextAuth utilisent l'URL correcte dans la console du navigateur
