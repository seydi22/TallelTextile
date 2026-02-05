# Instructions d'Installation - Talel Textile

## 📋 Prérequis

1. **Node.js** (version 18 ou supérieure) et **npm**
   - Télécharger depuis : https://nodejs.org/en
   - Tutoriel d'installation : https://www.youtube.com/watch?v=4FAtFwKVhn0

2. **MongoDB** (version 6.0 ou supérieure)
   - Télécharger depuis : https://www.mongodb.com/try/download/community
   - Documentation d'installation : https://www.mongodb.com/docs/manual/installation/

3. **MongoDB Compass** (optionnel mais recommandé)
   - Télécharger depuis : https://www.mongodb.com/products/compass

## 🚀 Installation

### Étape 1 : Cloner le projet

```bash
git clone <url-du-repo>
cd Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS
```

### Étape 2 : Installer les dépendances

**À la racine du projet :**
```bash
npm install
```

**Dans le dossier server :**
```bash
cd server
npm install
cd ..
```

### Étape 3 : Configuration de l'environnement

**Créer un fichier `.env` à la racine du projet :**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
DATABASE_URL="mongodb://localhost:27017/singitronic_nextjs"
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000
```

**Créer un fichier `.env` dans le dossier `server/` :**

```env
NODE_ENV=development
DATABASE_URL="mongodb://localhost:27017/singitronic_nextjs"
```

> ⚠️ **Important :** Remplacez `NEXTAUTH_SECRET` par une clé secrète générée aléatoirement (minimum 32 caractères). Vous pouvez en générer une avec :
> ```bash
> openssl rand -base64 32
> ```

### Étape 4 : Configuration de la base de données

**Assurez-vous que MongoDB est démarré :**

```bash
# Sur Windows (si installé comme service, il démarre automatiquement)
# Sur macOS/Linux
mongod
```

**Générer le client Prisma :**

```bash
npx prisma generate
```

**Créer la base de données et les collections :**

```bash
npx prisma db push
```

### Étape 5 : Insérer les données de démonstration

```bash
cd server/utills
node insertDemoData.js
cd ../..
```

### Étape 6 : Créer un utilisateur administrateur

```bash
cd server
node createAdminUser.js admin@example.com VotreMotDePasse123!
cd ..
```

> ⚠️ **Important :** Le mot de passe doit contenir :
> - Au moins 8 caractères
> - Au moins une majuscule
> - Au moins une minuscule
> - Au moins un chiffre
> - Au moins un caractère spécial (@$!%*?&)

### Étape 7 : Démarrer l'application

**Terminal 1 - Démarrer le serveur backend :**

```bash
cd server
node app.js
```

**Terminal 2 - Démarrer le serveur frontend :**

```bash
npm run dev
```

### Étape 8 : Accéder à l'application

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:3001
- **Prisma Studio :** `npx prisma studio` (pour visualiser la base de données)

## 🔐 Authentification

L'authentification est maintenant fonctionnelle avec NextAuth. Vous pouvez :

1. Vous connecter avec les identifiants admin créés à l'étape 6
2. Accéder au dashboard admin à `/admin`
3. Créer de nouveaux utilisateurs via l'API ou le dashboard

## 🛠️ Commandes Utiles

```bash
# Générer le client Prisma
npm run db:generate

# Synchroniser le schéma avec la base de données
npm run db:push

# Ouvrir Prisma Studio
npm run db:studio

# Lancer le linter
npm run lint
```

## ⚠️ Problèmes Courants

### Erreur de connexion à MongoDB

- Vérifiez que MongoDB est démarré
- Vérifiez que l'URL de connexion dans `.env` est correcte
- Vérifiez que le port 27017 n'est pas bloqué par un firewall

### Erreur NextAuth

- Vérifiez que `NEXTAUTH_SECRET` est défini et contient au moins 32 caractères
- Vérifiez que `NEXTAUTH_URL` correspond à l'URL de votre application

### Erreur Prisma

- Exécutez `npx prisma generate` après chaque modification du schéma
- Vérifiez que la base de données MongoDB est accessible

## 📝 Notes

- L'application utilise **MongoDB** (pas MySQL comme mentionné dans certains fichiers)
- Les mots de passe sont hashés avec bcrypt (14 rounds)
- L'authentification utilise NextAuth avec stratégie JWT
- Les sessions durent 30 jours par défaut
