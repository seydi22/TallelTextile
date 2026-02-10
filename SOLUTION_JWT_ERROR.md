# 🔧 Solution à l'Erreur JWT Decryption

## Problème

```
[next-auth][error][JWT_SESSION_ERROR] decryption operation failed
```

Cette erreur se produit quand NextAuth essaie de décrypter un token JWT avec une clé secrète différente de celle utilisée pour le crypter.

## Causes Possibles

1. **NEXTAUTH_SECRET a changé** : Les cookies existantes ont été cryptées avec l'ancien secret
2. **NEXTAUTH_SECRET non défini** : NextAuth utilise un secret par défaut qui change à chaque redémarrage
3. **Cookies corrompues** : Les cookies dans le navigateur sont invalides

## Solutions

### Solution 1 : Nettoyer les Cookies (Recommandé)

**Dans le navigateur :**
1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Application" (Chrome) ou "Storage" (Firefox)
3. Dans "Cookies", supprimer tous les cookies pour `localhost:3001`
4. Recharger la page

**Ou via la console du navigateur :**
```javascript
// Supprimer tous les cookies NextAuth
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### Solution 2 : Vérifier NEXTAUTH_SECRET

Assurez-vous que `NEXTAUTH_SECRET` est bien défini dans `apps/admin/.env.local` :

```env
NEXTAUTH_SECRET=dev-secret-key-change-in-production-please
```

**Important** : Le secret doit être :
- ✅ Une chaîne de caractères longue et aléatoire
- ✅ Le même à chaque redémarrage
- ✅ Différent en production

### Solution 3 : Générer un Nouveau Secret

Si le problème persiste, générez un nouveau secret :

```bash
# Dans PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Puis mettez à jour `apps/admin/.env.local` avec le nouveau secret.

### Solution 4 : Désactiver Temporairement la Session

Si vous voulez juste tester, vous pouvez temporairement désactiver la vérification de session dans `apps/admin/app/layout.tsx` :

```typescript
// Commenter temporairement
// let session = null;
// try {
//   session = await getServerSession(authOptions);
// } catch (error: any) {
//   console.error("Erreur lors de la récupération de la session:", error?.message || error);
//   session = null;
// }
```

## Vérification

Après avoir nettoyé les cookies et redémarré :

1. **Redémarrer le serveur admin** :
   ```bash
   cd apps/admin
   pnpm dev
   ```

2. **Aller sur** : http://localhost:3001/login

3. **Se connecter** avec vos identifiants

4. **Vérifier** que l'erreur a disparu

## Note sur le 404

Le `GET http://localhost:3001/ 404` est **normal** :
- Le backend n'a pas de route à la racine `/`
- Le backend écoute sur `/api/*` uniquement
- Ce warning peut être ignoré
