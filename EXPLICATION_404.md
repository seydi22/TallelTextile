# ✅ Explication du 404 sur localhost:3001/

## Problème

```
GET http://localhost:3001/ 404 (Not Found)
```

## Solution

Une page d'accueil a été créée dans `apps/admin/app/page.tsx` qui :
- ✅ Redirige vers `/login` si l'utilisateur n'est pas connecté
- ✅ Redirige vers `/admin` si l'utilisateur est connecté

## Comportement Maintenant

Quand vous accédez à `http://localhost:3001/` :

1. **Si pas de session** → Redirection automatique vers `/login`
2. **Si session valide** → Redirection automatique vers `/admin` (dashboard)

## Routes Disponibles

- `/` → Redirige vers `/login` ou `/admin` selon la session
- `/login` → Page de connexion
- `/admin` → Dashboard admin (nécessite authentification)
- `/admin/products` → Gestion des produits
- `/admin/categories` → Gestion des catégories
- `/admin/orders` → Gestion des commandes
- etc.

## Note sur le Backend

Le backend (port 5000) n'a **pas** de route à la racine `/` :
- ✅ C'est **normal** et **attendu**
- ✅ Le backend écoute uniquement sur `/api/*`
- ✅ Les routes disponibles sont :
  - `/api/products`
  - `/api/categories`
  - `/api/auth/login`
  - `/api/test`
  - `/health`
  - etc.

## Test

1. **Aller sur** : http://localhost:3001/
2. **Vous serez automatiquement redirigé** vers `/login`
3. **Après connexion**, vous serez redirigé vers `/admin`

Le 404 devrait maintenant disparaître ! 🎉
