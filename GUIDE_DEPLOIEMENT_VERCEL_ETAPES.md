# 🚀 Guide Pas à Pas - Déploiement Vercel

## 📋 Checklist de préparation

Avant de commencer, vérifiez que vous avez :
- [ ] Un compte GitHub
- [ ] Un compte Vercel (gratuit)
- [ ] Votre projet sur GitHub
- [ ] MongoDB Atlas configuré
- [ ] Node.js installé localement

---

## ÉTAPE 1 : Préparer votre projet GitHub

### 1.1 Créer un repository GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **New repository**
3. Nommez-le : `talel-textile` (ou autre nom)
4. Choisissez **Public** ou **Private**
5. **Ne cochez pas** "Initialize with README"
6. Cliquez sur **Create repository**

### 1.2 Pousser votre code sur GitHub

Ouvrez votre terminal dans le dossier du projet :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Prêt pour Vercel"

# Ajouter le remote GitHub (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/talel-textile.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

## ÉTAPE 2 : Installer Vercel CLI

### 2.1 Installer Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Vérifier l'installation

```bash
vercel --version
```

Vous devriez voir quelque chose comme : `vercel/32.x.x`

---

## ÉTAPE 3 : Se connecter à Vercel

### 3.1 Se connecter

```bash
vercel login
```

Vous aurez deux options :
1. **Continue with GitHub** (recommandé) - Cliquez sur le lien
2. **Continue with Email** - Entrez votre email

### 3.2 Autoriser Vercel

Si vous choisissez GitHub :
- Une page s'ouvrira dans votre navigateur
- Cliquez sur **Authorize Vercel**
- Revenez au terminal

---

## ÉTAPE 4 : Configurer le projet pour Vercel

### 4.1 Les fichiers sont déjà créés

Les fichiers suivants ont été créés pour vous :
- ✅ `vercel.json` - Configuration Vercel
- ✅ `api/vercel-serverless.js` - Wrapper pour le backend

### 4.2 Vérifier que tout est prêt

Assurez-vous que ces fichiers existent :
- `vercel.json` à la racine
- `api/vercel-serverless.js` à la racine
- `server/app.js` modifié pour supporter Vercel

---

## ÉTAPE 5 : Premier déploiement

### 5.1 Initialiser Vercel dans le projet

Dans le terminal, à la racine du projet :

```bash
vercel
```

### 5.2 Répondre aux questions

```
? Set up and deploy "~/Desktop/Talel Textile/template/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS"? [Y/n] y
? Which scope? (Use arrow keys)
  > Votre compte
? Link to existing project? [y/N] n
? What's your project's name? talel-textile
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

### 5.3 Attendre le déploiement

Vercel va :
1. Détecter Next.js
2. Installer les dépendances
3. Builder le projet
4. Déployer

Vous verrez quelque chose comme :
```
✅ Production: https://talel-textile.vercel.app
```

---

## ÉTAPE 6 : Configurer les variables d'environnement

### 6.1 Obtenir votre URL Vercel

Après le déploiement, notez votre URL :
```
https://talel-textile-xxxxx.vercel.app
```

### 6.2 Ajouter les variables dans Vercel

**Option A : Via l'interface web (recommandé)**

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous
3. Cliquez sur votre projet `talel-textile`
4. Allez dans **Settings** → **Environment Variables**
5. Ajoutez chaque variable :

#### Variables Frontend :

| Nom | Valeur | Environnements |
|-----|--------|----------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://talel-textile-xxxxx.vercel.app/api` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://talel-textile-xxxxx.vercel.app` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | (générez avec `openssl rand -base64 32`) | Production, Preview, Development |

#### Variables Backend :

| Nom | Valeur | Environnements |
|-----|--------|----------------|
| `DATABASE_URL` | `votre-connection-string-mongodb` | Production, Preview, Development |
| `FRONTEND_URL` | `https://talel-textile-xxxxx.vercel.app` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://talel-textile-xxxxx.vercel.app` | Production, Preview, Development |

**Option B : Via la CLI**

```bash
# Générer un secret NextAuth
openssl rand -base64 32

# Ajouter les variables (remplacez les valeurs)
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Entrez : https://talel-textile-xxxxx.vercel.app/api

vercel env add NEXTAUTH_URL production
# Entrez : https://talel-textile-xxxxx.vercel.app

vercel env add NEXTAUTH_SECRET production
# Collez le secret généré

vercel env add DATABASE_URL production
# Entrez votre connection string MongoDB

# Répétez pour Preview et Development si nécessaire
```

### 6.3 Redéployer après avoir ajouté les variables

```bash
vercel --prod
```

---

## ÉTAPE 7 : Mettre à jour CORS

### 7.1 Modifier server/app.js

Ouvrez `server/app.js` et trouvez la section `allowedOrigins` (vers la ligne 64).

Ajoutez votre URL Vercel :

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXTAUTH_URL,
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://talel-textile-xxxxx.vercel.app', // Remplacez par votre URL
].filter(Boolean);
```

### 7.2 Commiter et pousser

```bash
git add server/app.js
git commit -m "Ajout URL Vercel dans CORS"
git push
```

Vercel redéploiera automatiquement.

---

## ÉTAPE 8 : Vérifier le déploiement

### 8.1 Tester la page d'accueil

1. Allez sur votre URL Vercel
2. Vérifiez que la page s'affiche correctement

### 8.2 Tester les API

Testez ces endpoints dans votre navigateur :

- Health check : `https://talel-textile-xxxxx.vercel.app/api/health`
- Catégories : `https://talel-textile-xxxxx.vercel.app/api/categories`
- Produits : `https://talel-textile-xxxxx.vercel.app/api/products`

### 8.3 Vérifier les logs

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur votre projet
3. Allez dans **Deployments**
4. Cliquez sur le dernier déploiement
5. Allez dans **Functions** pour voir les logs

---

## ÉTAPE 9 : Configurer le déploiement automatique

### 9.1 Connecter GitHub (si pas déjà fait)

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **Add New Project**
3. Importez votre repository GitHub
4. Vercel détectera automatiquement Next.js

### 9.2 Configuration automatique

Vercel configurera :
- ✅ Build Command : `npm run build`
- ✅ Output Directory : `.next`
- ✅ Install Command : `npm install`

### 9.3 Déploiements automatiques

Maintenant, à chaque fois que vous poussez sur GitHub :
- Push sur `main` → Déploiement en **production**
- Push sur autre branche → Déploiement en **preview**

---

## ÉTAPE 10 : Tester l'application complète

### 10.1 Tester la navigation

- [ ] Page d'accueil s'affiche
- [ ] Navigation fonctionne
- [ ] Catégories s'affichent
- [ ] Produits s'affichent

### 10.2 Tester l'admin

- [ ] Se connecter à `/admin`
- [ ] Voir les produits
- [ ] Voir les catégories
- [ ] Ajouter un produit (test)

### 10.3 Tester les fonctionnalités

- [ ] Ajouter au panier
- [ ] Voir le panier
- [ ] Checkout (test)

---

## 🐛 Dépannage

### Erreur : "Cannot find module"

**Solution :** Vérifiez que toutes les dépendances sont dans `package.json`

```bash
npm install
git add package.json package-lock.json
git commit -m "Mise à jour dépendances"
git push
```

### Erreur : "CORS policy"

**Solution :** Vérifiez que votre URL Vercel est dans `allowedOrigins` dans `server/app.js`

### Erreur : "DATABASE_URL not found"

**Solution :** 
1. Vérifiez que `DATABASE_URL` est bien ajouté dans Vercel
2. Redéployez : `vercel --prod`

### Erreur : "Build failed"

**Solution :**
1. Testez le build localement : `npm run build`
2. Vérifiez les logs dans Vercel Dashboard
3. Corrigez les erreurs et poussez à nouveau

### Les images ne s'affichent pas

**Solution :**
1. Vérifiez que le dossier `public/` est bien dans le repository
2. Vérifiez les chemins (doivent commencer par `/`)

---

## ✅ Checklist finale

- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS mis à jour
- [ ] Page d'accueil fonctionne
- [ ] API fonctionnent
- [ ] Déploiement automatique configuré
- [ ] Application testée

---

## 🎉 Félicitations !

Votre application est maintenant en ligne sur Vercel !

**Prochaines étapes :**
- Configurer un domaine personnalisé (optionnel)
- Activer les analytics Vercel
- Configurer les webhooks

**Besoin d'aide ?**
- Documentation Vercel : https://vercel.com/docs
- Support Vercel : https://vercel.com/support
