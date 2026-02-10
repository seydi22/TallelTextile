# 🍪 Instructions Rapides : Nettoyer les Cookies

## ⚡ Solution la Plus Rapide

### Option 1 : Via DevTools (Recommandé)

1. **Appuyer sur `F12`** pour ouvrir les DevTools
2. **Aller dans l'onglet "Application"** (ou "Storage" sur Firefox)
3. **Dans le menu de gauche** : Cliquer sur **"Cookies"** → `http://localhost:3001`
4. **Sélectionner tous les cookies** qui commencent par `next-auth.`
5. **Clic droit** → **Delete** (ou appuyer sur `Suppr`)
6. **Recharger la page** : `Ctrl+R`

### Option 2 : Via Console (Automatique)

1. **Appuyer sur `F12`** → Onglet **"Console"**
2. **Coller ce code** et appuyer sur Entrée :

```javascript
document.cookie.split(";").forEach(c => {
  const cookieName = c.split("=")[0].trim();
  if (cookieName.startsWith("next-auth.") || cookieName.includes("session")) {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost`;
  }
});
console.log("✅ Cookies supprimés");
location.reload();
```

### Option 3 : Navigation Privée

1. **Ouvrir une fenêtre privée** : `Ctrl+Shift+N` (Chrome) ou `Ctrl+Shift+P` (Firefox)
2. **Aller sur** : http://localhost:3001/login
3. **Se connecter** normalement

## ✅ Après le Nettoyage

1. L'erreur JWT devrait disparaître
2. Vous devrez vous reconnecter
3. La session fonctionnera normalement

## 📝 Note

L'erreur est maintenant gérée silencieusement par l'application. Même si elle apparaît dans les logs, l'app continue de fonctionner et vous pouvez simplement vous reconnecter.
