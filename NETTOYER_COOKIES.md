# 🍪 Comment Nettoyer les Cookies NextAuth

## Méthode 1 : Via les DevTools du Navigateur

1. **Ouvrir les DevTools** : Appuyez sur `F12` ou `Ctrl+Shift+I`

2. **Aller dans l'onglet "Application"** (Chrome) ou "Storage" (Firefox)

3. **Dans le menu de gauche**, cliquez sur "Cookies" → `http://localhost:3001`

4. **Sélectionner tous les cookies** et les supprimer :
   - Cookies commençant par `next-auth.`
   - Tous les autres cookies si nécessaire

5. **Recharger la page** : `Ctrl+R` ou `F5`

## Méthode 2 : Via la Console du Navigateur

1. **Ouvrir la Console** : `F12` → Onglet "Console"

2. **Coller ce code** et appuyer sur Entrée :

```javascript
// Supprimer tous les cookies NextAuth
document.cookie.split(";").forEach(c => {
  const cookieName = c.split("=")[0].trim();
  if (cookieName.startsWith("next-auth.") || cookieName.includes("session")) {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost`;
  }
});
console.log("✅ Cookies NextAuth supprimés");
```

3. **Recharger la page** : `Ctrl+R`

## Méthode 3 : Mode Navigation Privée

1. **Ouvrir une fenêtre de navigation privée** : `Ctrl+Shift+N` (Chrome) ou `Ctrl+Shift+P` (Firefox)

2. **Aller sur** : http://localhost:3001/login

3. **Se connecter** avec vos identifiants

## Méthode 4 : Vider le Cache du Navigateur

1. **Ouvrir les paramètres du navigateur**

2. **Effacer les données de navigation** :
   - Cookies et données de sites
   - Images et fichiers en cache

3. **Redémarrer le navigateur**

## Après le Nettoyage

1. **Redémarrer le serveur admin** :
   ```bash
   cd apps/admin
   pnpm dev
   ```

2. **Aller sur** : http://localhost:3001/login

3. **Se connecter** avec vos identifiants

4. **Vérifier** que l'erreur JWT a disparu
