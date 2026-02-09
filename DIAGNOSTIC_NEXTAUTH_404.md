# 🔍 Diagnostic : NextAuth 404 sur Vercel

## ❌ Problème Observé

```
GET https://tallel-textile.vercel.app/api/auth/providers 404 (Not Found)
[next-auth][error][CLIENT_FETCH_ERROR] Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## ✅ Ce qui fonctionne

- ✅ La route NextAuth existe : `app/api/auth/[...nextauth]/route.ts`
- ✅ Le code est correct : exporte `GET` et `POST`
- ✅ L'API backend fonctionne (fallback forcé fonctionne)

## 🔍 Causes Possibles

### 1. Application non redéployée
**Solution :** Redéployer le frontend sur Vercel après les changements

### 2. Problème de build Vercel
**Vérification :**
- Aller dans Vercel Dashboard → Deployments
- Vérifier les logs de build
- Chercher les erreurs liées à NextAuth

### 3. Route non accessible (Edge Runtime)
**Solution :** S'assurer que `runtime = 'nodejs'` est bien défini

### 4. Variable d'environnement manquante
**Vérification :** `NEXTAUTH_SECRET` doit être défini dans Vercel

## 🛠️ Solutions à Essayer

### Solution 1 : Vérifier le Build Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner votre projet frontend
3. Aller dans **Deployments**
4. Cliquer sur le dernier déploiement
5. Vérifier les **Build Logs**
6. Chercher les erreurs liées à :
   - `app/api/auth/[...nextauth]/route.ts`
   - `next-auth`
   - `NEXTAUTH_SECRET`

### Solution 2 : Forcer un Redéploiement

```bash
# Si vous utilisez Git
git commit --allow-empty -m "Force redeploy for NextAuth"
git push

# Ou via Vercel CLI
vercel --prod
```

### Solution 3 : Vérifier les Variables d'Environnement

Dans Vercel Dashboard → Settings → Environment Variables :

**Frontend (tallel-textile.vercel.app) :**
```env
NEXTAUTH_URL=https://tallel-textile.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth (OBLIGATOIRE)
NEXT_PUBLIC_API_BASE_URL=https://tallel-textile-j62y.vercel.app/api
```

⚠️ **CRUCIAL** : `NEXTAUTH_SECRET` doit être défini, sinon NextAuth ne fonctionnera pas !

### Solution 4 : Tester Localement

```bash
# Démarrer le serveur local
npm run dev

# Tester l'endpoint
curl http://localhost:3000/api/auth/providers

# Doit retourner du JSON, pas un 404
```

Si ça fonctionne en local mais pas sur Vercel, c'est un problème de déploiement.

### Solution 5 : Vérifier la Configuration Next.js

Vérifier que `next.config.mjs` n'a pas de configuration qui bloque les routes API :

```javascript
// next.config.mjs ne doit PAS avoir de rewrites qui bloquent /api/auth/*
```

## 🧪 Test Rapide

Ouvrir dans le navigateur (après redéploiement) :
```
https://tallel-textile.vercel.app/api/auth/providers
```

**Résultat attendu :**
```json
{
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    "type": "credentials"
  }
}
```

**Si 404 :** La route n'est pas accessible → Vérifier le build Vercel
**Si HTML :** Erreur de configuration → Vérifier `NEXTAUTH_SECRET`

## 📝 Checklist de Vérification

- [ ] Application redéployée sur Vercel
- [ ] `NEXTAUTH_SECRET` défini dans Vercel (frontend)
- [ ] `NEXTAUTH_URL` défini dans Vercel (frontend)
- [ ] Build Vercel réussi (pas d'erreurs)
- [ ] Route testée localement (fonctionne)
- [ ] `/api/auth/providers` accessible (retourne JSON)

## 🔧 Si Rien ne Fonctionne

1. **Vérifier les logs Vercel** pour voir les erreurs exactes
2. **Créer un endpoint de test** pour vérifier que les routes API fonctionnent :
   ```typescript
   // app/api/test/route.ts
   export async function GET() {
     return Response.json({ message: "API routes work" });
   }
   ```
3. **Tester** : `https://tallel-textile.vercel.app/api/test`
4. Si `/api/test` fonctionne mais pas `/api/auth/providers`, c'est un problème spécifique à NextAuth
