# ✅ Solution : Architecture NextAuth avec Backend Séparé

## 🎯 Problème Résolu

NextAuth essayait d'accéder à une URL incorrecte (`https://tallel-textile.vercel.app/api/auth/providers`) au lieu de l'URL du frontend, causant des erreurs 404.

## 🔑 Point Crucial Compris

**NextAuth DOIT être hébergé sur la MÊME application que le frontend** car :
- NextAuth utilise des cookies liés au domaine
- Le frontend appelle toujours `/api/auth/*` sur son propre domaine
- Les cookies ne peuvent pas être partagés entre domaines différents

## ✅ Architecture Finale

```
┌─────────────────────────────────────┐
│  Frontend (tallel-textile.vercel.app)│
│  ┌─────────────────────────────────┐ │
│  │ NextAuth (/api/auth/*)          │ │ ← Cookies ici
│  │ - /api/auth/providers           │ │
│  │ - /api/auth/signin              │ │
│  │ - /api/auth/callback            │ │
│  └─────────────────────────────────┘ │
│           │                           │
│           │ Appelle le backend         │
│           ▼                           │
└───────────────────────────────────────┘
           │
           │ POST /api/auth/login
           │ { email, password }
           ▼
┌─────────────────────────────────────┐
│  Backend (tallel-textile-j62y...)   │
│  ┌─────────────────────────────────┐ │
│  │ /api/auth/login                │ │ ← Vérifie credentials
│  │ - Vérifie email + password     │ │
│  │ - Retourne user (sans pwd)    │ │
│  └─────────────────────────────────┘ │
└───────────────────────────────────────┘
```

## 📁 Fichiers Modifiés

### 1. `lib/authOptions.ts`
- ✅ Supprimé l'utilisation directe de Prisma
- ✅ `authorize()` appelle maintenant le backend `/api/auth/login`
- ✅ NextAuth reste dans le frontend (cookies OK)

### 2. `server/routes/auth.js` (NOUVEAU)
- ✅ Route `/api/auth/login` pour l'authentification

### 3. `server/controllers/auth.js` (NOUVEAU)
- ✅ Contrôleur qui vérifie email + password
- ✅ Retourne l'utilisateur sans le mot de passe

### 4. `server/app.js`
- ✅ Ajout de la route `/api/auth`
- ✅ Application du rate limiter `authLimiter`

## 🔧 Configuration Requise

### Variables d'Environnement Frontend (Vercel)

```env
NEXTAUTH_URL=https://tallel-textile.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth
NEXT_PUBLIC_API_BASE_URL=https://tallel-textile-j62y.vercel.app/api
```

⚠️ **IMPORTANT** : `NEXTAUTH_URL` doit pointer vers le **FRONTEND**, pas le backend !

### Variables d'Environnement Backend (Vercel)

```env
DATABASE_URL=votre-connection-string-mongodb
FRONTEND_URL=https://tallel-textile.vercel.app
NODE_ENV=production
```

## 🚀 Flux d'Authentification

1. **Utilisateur saisit email + password** → Page `/login`
2. **Frontend appelle NextAuth** → `signIn("credentials", {...})`
3. **NextAuth appelle `authorize()`** → Dans `lib/authOptions.ts`
4. **`authorize()` appelle le backend** → `POST https://tallel-textile-j62y.vercel.app/api/auth/login`
5. **Backend vérifie credentials** → Compare email + password avec la DB
6. **Backend retourne user** → `{ id, email, role }` (sans password)
7. **NextAuth crée la session** → JWT stocké dans un cookie sur le domaine frontend
8. **Utilisateur connecté** → Session disponible via `useSession()`

## ✅ Avantages de Cette Architecture

- ✅ **Cookies sur le bon domaine** : Frontend = cookies
- ✅ **Sécurité** : Password jamais exposé côté frontend
- ✅ **Séparation des responsabilités** : Backend = logique métier, Frontend = UI + auth
- ✅ **Scalabilité** : Backend peut être mis à l'échelle indépendamment

## 🧪 Test

1. Déployer le backend sur Vercel
2. Déployer le frontend sur Vercel
3. Configurer les variables d'environnement
4. Tester la connexion : `/login`
5. Vérifier que `/api/auth/providers` fonctionne (pas de 404)

## 📝 Notes Importantes

- NextAuth est **TOUJOURS** dans le frontend
- Le backend ne gère **QUE** la vérification des credentials
- Les cookies sont **TOUJOURS** sur le domaine du frontend
- `/api/auth/*` est **TOUJOURS** sur le frontend
