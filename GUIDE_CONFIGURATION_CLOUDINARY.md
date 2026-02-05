# 📸 Guide de Configuration Cloudinary

Ce guide vous accompagne pour configurer Cloudinary dans votre application Talel Textile.

---

## 📋 Table des matières

1. [Créer un compte Cloudinary](#1-créer-un-compte-cloudinary)
2. [Récupérer les credentials](#2-récupérer-les-credentials)
3. [Configurer les variables d'environnement](#3-configurer-les-variables-denvironnement)
4. [Installer la dépendance](#4-installer-la-dépendance)
5. [Vérifier la configuration](#5-vérifier-la-configuration)
6. [Tester l'upload](#6-tester-lupload)
7. [Dépannage](#7-dépannage)

---

## 1. Créer un compte Cloudinary

### Étape 1.1 : Inscription

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Cliquez sur **Sign Up** (gratuit)
3. Remplissez le formulaire :
   - Email
   - Nom d'utilisateur
   - Mot de passe
4. Confirmez votre email

### Étape 1.2 : Plan gratuit

Le plan gratuit offre :
- ✅ 25 GB de stockage
- ✅ 25 GB de bande passante par mois
- ✅ Transformations d'images illimitées
- ✅ CDN global

**C'est largement suffisant pour démarrer !**

---

## 2. Récupérer les credentials

Une fois connecté à votre compte Cloudinary :

### Étape 2.1 : Accéder au Dashboard

1. Connectez-vous à [cloudinary.com](https://cloudinary.com)
2. Cliquez sur **Dashboard** (en haut à droite)

### Étape 2.2 : Trouver les informations

Dans le Dashboard, vous verrez :

```
Account Details
├── Cloud name: votre-cloud-name
├── API Key: 123456789012345
└── API Secret: abcdefghijklmnopqrstuvwxyz123456
```

**⚠️ IMPORTANT :** 
- Le **API Secret** est confidentiel, ne le partagez jamais publiquement
- Ne commitez jamais ces valeurs dans Git

---

## 3. Configurer les variables d'environnement

### Étape 3.1 : Variables locales (Développement)

Créez ou modifiez le fichier `.env` à la racine du projet :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**Ou** dans `server/.env` si vous utilisez un fichier séparé pour le backend :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### Étape 3.2 : Variables Vercel (Production)

Après avoir déployé sur Vercel :

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable :

| Nom | Valeur | Environnements |
|-----|--------|----------------|
| `CLOUDINARY_CLOUD_NAME` | `votre-cloud-name` | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | `123456789012345` | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | `abcdefghijklmnopqrstuvwxyz123456` | Production, Preview, Development |

**⚠️ IMPORTANT :**
- Cochez **Production**, **Preview** et **Development** pour chaque variable
- Après avoir ajouté les variables, **redéployez** votre application

---

## 4. Installer la dépendance

La dépendance `cloudinary` a déjà été ajoutée au `package.json`.

### Étape 4.1 : Installer les dépendances

```bash
npm install
```

Cela installera automatiquement `cloudinary`.

### Étape 4.2 : Vérifier l'installation

```bash
npm list cloudinary
```

Vous devriez voir quelque chose comme :
```
cloudinary@2.x.x
```

---

## 5. Vérifier la configuration

### Étape 5.1 : Vérifier le code

Le fichier `server/controllers/mainImages.js` a déjà été configuré pour utiliser Cloudinary.

Vérifiez que le code contient :

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Étape 5.2 : Vérifier les variables d'environnement

**En développement local :**

```bash
# Vérifier que les variables sont chargées
node -e "require('dotenv').config(); console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME)"
```

**Sur Vercel :**

1. Allez dans **Settings** → **Environment Variables**
2. Vérifiez que les 3 variables sont présentes

---

## 6. Tester l'upload

### Étape 6.1 : Démarrer le serveur

```bash
# Terminal 1 : Backend
cd server
node app.js

# Terminal 2 : Frontend
npm run dev
```

### Étape 6.2 : Tester l'upload

1. Allez sur `http://localhost:3000/admin/products/new`
2. Remplissez le formulaire
3. Sélectionnez une image
4. Cliquez sur **Upload** ou **Save**

### Étape 6.3 : Vérifier dans Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Cliquez sur **Media Library**
3. Vous devriez voir un dossier `talel-textile` avec votre image

### Étape 6.4 : Vérifier dans la base de données

L'image devrait être sauvegardée avec une URL complète comme :
```
https://res.cloudinary.com/votre-cloud-name/image/upload/v1234567890/talel-textile/image.jpg
```

---

## 7. Dépannage

### Problème : "Configuration Cloudinary manquante"

**Symptôme :** Erreur 500 lors de l'upload avec le message "Configuration Cloudinary manquante"

**Solutions :**
1. Vérifiez que les variables d'environnement sont définies dans `.env`
2. Vérifiez que le fichier `.env` est dans le bon dossier (racine ou `server/`)
3. Redémarrez le serveur après avoir modifié `.env`
4. Vérifiez l'orthographe des noms de variables (doivent être exactement : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

### Problème : "Invalid API Key or Secret"

**Symptôme :** Erreur lors de l'upload avec le message "Invalid API Key or Secret"

**Solutions :**
1. Vérifiez que vous avez copié les bonnes valeurs depuis le Dashboard Cloudinary
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs dans `.env`
3. Vérifiez que vous n'avez pas mélangé l'API Key et l'API Secret

### Problème : Les images ne s'affichent pas

**Symptôme :** L'upload réussit mais l'image ne s'affiche pas dans le frontend

**Solutions :**
1. Vérifiez que l'URL Cloudinary est bien sauvegardée dans la base de données
2. Vérifiez que le composant utilise `getImageUrl()` de `@/utils/imageUtils`
3. Vérifiez la console du navigateur pour les erreurs CORS ou 404
4. Vérifiez que l'image est bien dans Cloudinary Media Library

### Problème : Erreur CORS avec Cloudinary

**Symptôme :** Les images Cloudinary ne se chargent pas à cause d'erreurs CORS

**Solutions :**
1. Cloudinary gère automatiquement les CORS, normalement pas de problème
2. Vérifiez que l'URL Cloudinary est correcte (commence par `https://res.cloudinary.com/`)
3. Vérifiez que votre compte Cloudinary n'est pas suspendu

### Problème : Limite de bande passante atteinte

**Symptôme :** Erreur lors de l'upload ou les images ne se chargent plus

**Solutions :**
1. Vérifiez votre utilisation dans le Dashboard Cloudinary
2. Le plan gratuit offre 25 GB/mois, c'est généralement suffisant
3. Si vous dépassez, vous pouvez :
   - Optimiser les images avant upload (réduire la taille)
   - Passer au plan payant
   - Attendre le mois suivant (reset mensuel)

---

## 📝 Checklist de Configuration

Avant de déployer en production, vérifiez :

- [ ] Compte Cloudinary créé
- [ ] Credentials récupérés depuis le Dashboard
- [ ] Variables d'environnement configurées localement (`.env`)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Dépendance `cloudinary` installée (`npm install`)
- [ ] Upload testé localement avec succès
- [ ] Images visibles dans Cloudinary Media Library
- [ ] Images s'affichent correctement dans le frontend
- [ ] Redéploiement effectué après configuration des variables Vercel

---

## 🎉 Félicitations !

Votre application est maintenant configurée pour utiliser Cloudinary !

**Avantages :**
- ✅ Images hébergées de manière fiable
- ✅ CDN global pour des chargements rapides
- ✅ Transformations d'images automatiques
- ✅ Compatible avec Vercel
- ✅ Gratuit jusqu'à 25 GB

---

## 📚 Ressources

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Dashboard Cloudinary](https://cloudinary.com/console)
- [Media Library](https://cloudinary.com/console/media_library)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)

---

## 🔄 Migration depuis les images locales

Si vous avez déjà des produits avec des images locales :

1. Les anciennes images continueront de fonctionner (chemins locaux)
2. Les nouvelles images utiliseront Cloudinary (URLs complètes)
3. La fonction `getImageUrl()` gère automatiquement les deux formats
4. Optionnel : Vous pouvez migrer les anciennes images vers Cloudinary manuellement

---

## 💡 Astuces

### Optimisation des images

Cloudinary peut automatiquement optimiser les images :

```javascript
// Dans mainImages.js, vous pouvez ajouter des transformations
const uploadResult = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'talel-textile',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Redimensionner
        { quality: 'auto' }, // Optimisation automatique
        { format: 'auto' } // Format optimal (WebP si supporté)
      ]
    },
    // ...
  );
  // ...
});
```

### Organisation des images

Les images sont organisées dans le dossier `talel-textile` dans Cloudinary. Vous pouvez créer des sous-dossiers :

```javascript
folder: 'talel-textile/products' // Pour les produits
folder: 'talel-textile/categories' // Pour les catégories
```

---

**Besoin d'aide ?** Consultez la [documentation Cloudinary](https://cloudinary.com/documentation) ou créez un ticket de support.
