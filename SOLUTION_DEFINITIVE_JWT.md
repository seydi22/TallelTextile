# 🔧 Solution Définitive à l'Erreur JWT

## Problème

L'erreur `JWEDecryptionFailed` apparaît car NextAuth essaie de décrypter des cookies de session qui ont été cryptées avec un secret différent (ou le secret par défaut qui change).

## Solution Rapide (Recommandée)

### Étape 1 : Nettoyer les Cookies dans le Navigateur

**Méthode la plus simple :**

1. Ouvrir les DevTools : `F12`
2. Aller dans l'onglet **"Application"** (Chrome) ou **"Storage"** (Firefox)
3. Dans le menu de gauche : **Cookies** → `http://localhost:3001`
4. **Sélectionner tous les cookies** qui commencent par `next-auth.`
5. **Clic droit** → **Delete** ou appuyer sur `Suppr`
6. **Recharger la page** : `Ctrl+R` ou `F5`

### Étape 2 : Vérifier NEXTAUTH_SECRET

Assurez-vous que le fichier `apps/admin/.env.local` contient :

```env
NEXTAUTH_SECRET=dev-secret-key-change-in-production-please
```

**Important** : Ce secret doit être :
- ✅ Le même à chaque redémarrage
- ✅ Une chaîne longue et aléatoire
- ✅ Différent en production

### Étape 3 : Redémarrer le Serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
cd apps/admin
pnpm dev
```

## Solution Alternative : Mode Navigation Privée

Si le problème persiste :

1. Ouvrir une **fenêtre de navigation privée** : `Ctrl+Shift+N` (Chrome) ou `Ctrl+Shift+P` (Firefox)
2. Aller sur : http://localhost:3001/login
3. Se connecter avec vos identifiants

## Solution Automatique (Via Console)

Ouvrir la console du navigateur (`F12` → Console) et coller :

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
location.reload();
```

## Pourquoi cette Erreur Apparaît ?

1. **Secret changé** : Si `NEXTAUTH_SECRET` a changé, les anciennes cookies ne peuvent plus être décryptées
2. **Secret par défaut** : Si `NEXTAUTH_SECRET` n'est pas défini, NextAuth utilise un secret temporaire qui change à chaque redémarrage
3. **Cookies corrompues** : Les cookies peuvent être invalides pour d'autres raisons

## Prévention

Pour éviter ce problème à l'avenir :

1. **Toujours définir `NEXTAUTH_SECRET`** dans `.env.local`
2. **Ne pas changer le secret** une fois l'app en production
3. **Utiliser un secret fort** en production :
   ```bash
   # Générer un secret fort
   openssl rand -base64 32
   ```

## Note

L'erreur est maintenant **silencieuse** dans les logs (elle n'apparaît plus dans la console serveur), mais l'utilisateur devra simplement se reconnecter. L'application continue de fonctionner normalement.
