# 🚀 Guide Complet - Déploiement sur Vercel

Ce guide vous accompagne étape par étape pour déployer votre application (frontend Next.js + backend Express) sur Vercel.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Préparation du projet](#préparation-du-projet)
3. [Configuration Vercel](#configuration-vercel)
4. [Déploiement du Frontend](#déploiement-du-frontend)
5. [Déploiement du Backend](#déploiement-du-backend)
6. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
7. [Vérification et tests](#vérification-et-tests)
8. [Dépannage](#dépannage)

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte GitHub (gratuit)
- ✅ Un compte Vercel (gratuit) - [vercel.com](https://vercel.com)
- ✅ Votre projet sur GitHub (ou prêt à être poussé)
- ✅ MongoDB Atlas configuré (votre base de données)
- ✅ Node.js installé localement (pour les tests)

---

## 🔧 Étape 1 : Préparation du projet

### 1.1 Créer un fichier `.gitignore` (si pas déjà présent)

Assurez-vous que votre `.gitignore` contient :

```gitignore
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
server/.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# Vercel
.vercel

# Prisma
prisma/migrations/
```

### 1.2 Préparer le backend pour Vercel

Le backend Express doit être converti en Serverless Functions Vercel. Nous allons créer un wrapper.

---

## ⚙️ Étape 2 : Configuration Vercel

### 2.1 Créer le fichier `vercel.json`

Créez un fichier `vercel.json` à la racine du projet :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      "src": "server/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/app.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2.2 Créer un wrapper pour le backend

Créez `api/index.js` à la racine (pour Vercel Serverless Functions) :

```javascript
const app = require('../server/app');

module.exports = app;
```

### 2.3 Modifier `server/app.js` pour Vercel

À la fin de `server/app.js`, remplacez le code de démarrage du serveur par :

```javascript
// ... votre code existant ...

// Export pour Vercel Serverless Functions
if (require.main === module) {
  // Démarrer le serveur normalement en développement
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export pour Vercel
module.exports = app;
```

---

## 🌐 Étape 3 : Déploiement sur Vercel

### 3.1 Installer Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Se connecter à Vercel

```bash
vercel login
```

Suivez les instructions pour vous connecter avec votre compte GitHub.

### 3.3 Initialiser le projet Vercel

```bash
vercel
```

Répondez aux questions :
- **Set up and deploy?** → `Y`
- **Which scope?** → Choisissez votre compte
- **Link to existing project?** → `N` (première fois)
- **Project name?** → `talel-textile` (ou le nom que vous voulez)
- **Directory?** → `.` (racine)
- **Override settings?** → `N`

### 3.4 Déployer en production

```bash
vercel --prod
```

---

## 🔐 Étape 4 : Configuration des variables d'environnement

### 4.1 Variables nécessaires

Vous devez configurer ces variables dans Vercel :

#### Variables Frontend (Next.js) :
```
NEXT_PUBLIC_API_BASE_URL=https://votre-projet.vercel.app/api
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth
```

#### Variables Backend :
```
DATABASE_URL=votre-connection-string-mongodb
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://votre-projet.vercel.app
NEXTAUTH_URL=https://votre-projet.vercel.app
```

### 4.2 Ajouter les variables dans Vercel

**Option 1 : Via l'interface web**
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable une par une

**Option 2 : Via la CLI**
```bash
vercel env add NEXT_PUBLIC_API_BASE_URL
# Entrez la valeur : https://votre-projet.vercel.app/api
# Sélectionnez : Production, Preview, Development

vercel env add DATABASE_URL
# Entrez votre connection string MongoDB

vercel env add NEXTAUTH_SECRET
# Générez un secret : openssl rand -base64 32

# Répétez pour toutes les variables
```

### 4.3 Redéployer après avoir ajouté les variables

```bash
vercel --prod
```

---

## 📝 Étape 5 : Modifications nécessaires dans le code

### 5.1 Mettre à jour `lib/config.ts`

Assurez-vous que `lib/config.ts` utilise bien les variables d'environnement :

```typescript
export default {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
};
```

### 5.2 Mettre à jour CORS dans `server/app.js`

Modifiez la section CORS pour accepter votre domaine Vercel :

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXTAUTH_URL,
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://votre-projet.vercel.app', // Remplacez par votre URL Vercel
].filter(Boolean);
```

### 5.3 Adapter le chemin des fichiers uploadés

Dans `server/controllers/mainImages.js`, modifiez le chemin de sauvegarde :

```javascript
// Au lieu de '../public/'
const uploadPath = path.join(process.cwd(), 'public', uploadedFile.name);
```

---

## ✅ Étape 6 : Vérification

### 6.1 Vérifier le déploiement

1. Allez sur votre URL Vercel : `https://votre-projet.vercel.app`
2. Vérifiez que la page d'accueil s'affiche
3. Testez la navigation

### 6.2 Vérifier les API

Testez les endpoints :
- `https://votre-projet.vercel.app/api/health`
- `https://votre-projet.vercel.app/api/categories`
- `https://votre-projet.vercel.app/api/products`

### 6.3 Vérifier les logs

Dans Vercel Dashboard :
1. Allez dans **Deployments**
2. Cliquez sur votre dernier déploiement
3. Allez dans **Functions** pour voir les logs

---

## 🔄 Étape 7 : Déploiement continu (GitHub)

### 7.1 Connecter GitHub

1. Allez sur [vercel.com](https://vercel.com)
2. **Add New Project**
3. Importez votre repository GitHub
4. Vercel détectera automatiquement Next.js

### 7.2 Configuration automatique

Vercel configurera automatiquement :
- ✅ Build Command : `npm run build`
- ✅ Output Directory : `.next`
- ✅ Install Command : `npm install`

### 7.3 Déploiements automatiques

À chaque push sur GitHub :
- `main` → Déploiement en production
- Autres branches → Déploiement en preview

---

## 🐛 Dépannage

### Problème : Erreur 404 sur les routes API

**Solution :** Vérifiez que `vercel.json` est correctement configuré et que les routes pointent vers `/server/app.js`

### Problème : CORS errors

**Solution :** Vérifiez que votre URL Vercel est dans `allowedOrigins` dans `server/app.js`

### Problème : Variables d'environnement non chargées

**Solution :** 
1. Vérifiez que les variables sont bien ajoutées dans Vercel
2. Redéployez après avoir ajouté les variables
3. Vérifiez que les variables commencent par `NEXT_PUBLIC_` pour le frontend

### Problème : Images ne s'affichent pas

**Solution :** 
1. Vérifiez que le dossier `public/` est bien inclus dans le déploiement
2. Vérifiez les chemins des images (doivent commencer par `/`)

### Problème : Base de données non accessible

**Solution :**
1. Vérifiez votre connection string MongoDB
2. Vérifiez que votre IP est autorisée dans MongoDB Atlas (ou utilisez `0.0.0.0/0` pour toutes les IPs)

### Problème : Build échoue

**Solution :**
1. Vérifiez les logs dans Vercel Dashboard
2. Testez le build localement : `npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📚 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Variables d'environnement](https://vercel.com/docs/environment-variables)

---

## 🎉 Félicitations !

Votre application est maintenant déployée sur Vercel ! 

**Prochaines étapes :**
- Configurez un domaine personnalisé (optionnel)
- Activez les analytics Vercel
- Configurez les webhooks pour les notifications
