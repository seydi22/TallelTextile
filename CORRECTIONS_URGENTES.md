# 🔧 Corrections Urgentes Appliquées

## ✅ Problème 1 : Double `/api` dans les URLs - CORRIGÉ

**Erreur observée :**
```
GET https://tallel-textile-j62y.vercel.app/api/api/categories 404
```

**Cause :**
- `NEXT_PUBLIC_API_BASE_URL` contient déjà `/api` (ex: `https://backend.vercel.app/api`)
- Les appels dans le code ajoutent aussi `/api` (ex: `/api/categories`)
- Résultat : `/api/api/categories` ❌

**Solution appliquée :**
- ✅ Modifié `lib/config.ts` pour retirer `/api` de `NEXT_PUBLIC_API_BASE_URL` si présent
- ✅ Les endpoints dans le code gardent `/api/categories` comme prévu

**Fichiers modifiés :**
- `lib/config.ts` - Retire `/api` de l'URL de base
- `lib/api.ts` - Normalise les endpoints

## ⚠️ Problème 2 : NextAuth 404 - À VÉRIFIER

**Erreur observée :**
```
GET https://tallel-textile.vercel.app/api/auth/providers 404
```

**Cause possible :**
1. Application non redéployée après les changements
2. Variable `NEXTAUTH_URL` mal configurée dans Vercel
3. Route NextAuth non accessible

**Solution :**

### Étape 1 : Vérifier la configuration Vercel (Frontend)

Dans Vercel Dashboard → Settings → Environment Variables :

```env
NEXTAUTH_URL=https://tallel-textile.vercel.app  # ← URL du FRONTEND
NEXTAUTH_SECRET=votre-secret-nextauth
NEXT_PUBLIC_API_BASE_URL=https://tallel-textile-j62y.vercel.app/api
```

⚠️ **CRUCIAL** : `NEXTAUTH_URL` doit être l'URL du **FRONTEND**, pas du backend !

### Étape 2 : Redéployer le Frontend

```bash
# Si vous utilisez Git
git add .
git commit -m "Fix: Correction double /api et configuration NextAuth"
git push

# Vercel redéploiera automatiquement
```

### Étape 3 : Vérifier que la route existe

La route doit exister dans le frontend :
- ✅ `app/api/auth/[...nextauth]/route.ts` existe
- ✅ Exporte `GET` et `POST`
- ✅ Utilise `authOptions` de `lib/authOptions.ts`

## 🧪 Test après déploiement

1. **Vérifier les catégories :**
   - Ouvrir la console
   - L'URL doit être : `https://tallel-textile-j62y.vercel.app/api/categories`
   - ❌ Plus de `/api/api/categories`

2. **Vérifier NextAuth :**
   - Ouvrir : `https://tallel-textile.vercel.app/api/auth/providers`
   - Doit retourner du JSON (pas de 404)
   - Doit afficher les providers disponibles

3. **Tester la connexion :**
   - Aller sur `/login`
   - Essayer de se connecter
   - Vérifier que ça fonctionne

## 📝 Checklist de Déploiement

- [ ] Variables d'environnement configurées dans Vercel (Frontend)
- [ ] `NEXTAUTH_URL` pointe vers le frontend (pas le backend)
- [ ] Frontend redéployé
- [ ] Backend redéployé (avec les nouveaux fichiers `server/routes/auth.js` et `server/controllers/auth.js`)
- [ ] Test de `/api/auth/providers` (doit retourner JSON)
- [ ] Test de connexion fonctionnel

## 🔍 Debug

Si NextAuth retourne toujours 404 après redéploiement :

1. Vérifier les logs Vercel :
   - Vercel Dashboard → Deployments → Voir les logs
   - Chercher les erreurs de build

2. Vérifier que la route est bien exportée :
   ```typescript
   // app/api/auth/[...nextauth]/route.ts
   export { handler as GET, handler as POST };
   ```

3. Tester localement :
   ```bash
   npm run dev
   # Ouvrir http://localhost:3000/api/auth/providers
   # Doit retourner du JSON
   ```
