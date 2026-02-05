# Guide de Dépannage - Talel Textile

Ce guide vous aide à résoudre les problèmes courants lors de l'utilisation de l'application.

## 🔴 Problème 1 : Erreur de connexion MongoDB lors de la création d'admin

### Symptômes
```
Error creating a database connection. (Kind: An error occurred during DNS resolution: 
proto error: io error: Une opération a été tentée sur un réseau impossible à atteindre.)
```

### Solutions

#### 1. Vérifier que MongoDB est démarré

**Sur Windows :**
- Ouvrez le Gestionnaire de services Windows (services.msc)
- Cherchez "MongoDB" dans la liste
- Si le service est arrêté, cliquez-droit → Démarrer
- Ou vérifiez dans le Gestionnaire des tâches si `mongod.exe` est en cours d'exécution

**Sur macOS/Linux :**
```bash
# Vérifier si MongoDB est en cours d'exécution
ps aux | grep mongod

# Si ce n'est pas le cas, démarrer MongoDB
mongod
```

#### 2. Vérifier la configuration DATABASE_URL

Assurez-vous que le fichier `server/.env` existe et contient :

```env
DATABASE_URL="mongodb://localhost:27017/singitronic_nextjs"
```

**Note :** 
- Si MongoDB est sur un autre port, modifiez `27017` par le bon port
- Si MongoDB nécessite une authentification, utilisez : `mongodb://username:password@localhost:27017/singitronic_nextjs`

#### 3. Tester la connexion MongoDB

```bash
cd server
node test-db-connection.js
```

#### 4. Vérifier que le port 27017 n'est pas bloqué

Sur Windows, vérifiez le pare-feu Windows :
- Paramètres → Pare-feu Windows → Paramètres avancés
- Vérifiez que MongoDB est autorisé

---

## 🔴 Problème 2 : Erreur "fetch failed" sur le dashboard

### Symptômes
```
fetch failed
at ProductsSection (components\ProductsSection.tsx:21:18)
```

### Cause
Le backend API (serveur Express) n'est pas démarré. Le frontend essaie de se connecter à `http://localhost:3001` mais le serveur n'est pas accessible.

### Solution

#### Démarrer le serveur backend

**Terminal 1 - Backend :**
```bash
cd server
node app.js
```

Vous devriez voir :
```
Server running on port 3001
Rate limiting and request logging enabled for all endpoints
```

#### Démarrer le serveur frontend

**Terminal 2 - Frontend :**
```bash
# Depuis la racine du projet
npm run dev
```

Vous devriez voir :
```
- ready started server on 0.0.0.0:3000
```

### Vérification

1. **Backend accessible ?**
   - Ouvrez http://localhost:3001/api/products dans votre navigateur
   - Vous devriez voir une réponse JSON (même vide)

2. **Frontend accessible ?**
   - Ouvrez http://localhost:3000
   - La page d'accueil devrait se charger

3. **Variables d'environnement ?**
   - Vérifiez que `.env` à la racine contient :
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

---

## 🔴 Problème 3 : Erreur JWT_SESSION_ERROR "decryption operation failed"

### Symptômes
```
[next-auth][error][JWT_SESSION_ERROR] "decryption operation failed"
```

### Cause
Cette erreur se produit généralement quand :
- `NEXTAUTH_SECRET` a changé ou n'est pas défini
- Les cookies de session dans le navigateur sont corrompus ou invalides
- Il y a un problème avec le secret de chiffrement

### Solutions

#### 1. Vérifier NEXTAUTH_SECRET

Assurez-vous que `.env` à la racine contient :
```env
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
```

**Important :** Le secret doit faire au moins 32 caractères.

#### 2. Générer un nouveau secret (si nécessaire)

```bash
# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Sur macOS/Linux
openssl rand -base64 32
```

#### 3. Effacer les cookies du navigateur

L'erreur peut être causée par des cookies corrompus :

**Chrome/Edge :**
- F12 → Application → Cookies → Supprimer les cookies pour `localhost:3000`

**Firefox :**
- F12 → Stockage → Cookies → Supprimer les cookies pour `localhost:3000`

**Ou simplement :**
- Ouvrez une fenêtre de navigation privée
- Ou supprimez tous les cookies pour localhost

#### 4. Redémarrer le serveur de développement

Après avoir modifié `.env`, redémarrez le serveur :
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

---

## 🔴 Problème 4 : Erreur lors de la connexion admin

### Symptômes
- Redirection vers `/login` au lieu du dashboard
- Message "Email ou mot de passe incorrect"

### Solutions

#### 1. Vérifier que l'utilisateur admin existe

```bash
cd server
node listUsers.js
```

#### 2. Créer un nouvel admin si nécessaire

```bash
cd server
npm run create:admin admin@example.com MonMotDePasse123!
```

**Important :** Le mot de passe doit contenir :
- Au moins 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%*?&)

#### 3. Vérifier NEXTAUTH_SECRET

Assurez-vous que `.env` à la racine contient :
```env
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔴 Problème 5 : Erreur Prisma

### Symptômes
```
Error: Can't reach database server at `localhost:27017`
```

### Solutions

1. **Générer le client Prisma :**
   ```bash
   npx prisma generate
   ```

2. **Vérifier le schéma :**
   ```bash
   npx prisma db push
   ```

3. **Vérifier la connexion MongoDB** (voir Problème 1)

---

## ✅ Checklist de Démarrage

Avant de démarrer l'application, assurez-vous que :

- [ ] MongoDB est démarré et accessible
- [ ] Les fichiers `.env` sont créés (racine et `server/`)
- [ ] `DATABASE_URL` est correctement configuré
- [ ] `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001` est dans `.env` à la racine
- [ ] Prisma Client est généré : `npx prisma generate`
- [ ] La base de données est initialisée : `npx prisma db push`
- [ ] Un compte admin existe (créé avec `createAdminUser.js`)
- [ ] Le backend est démarré : `cd server && node app.js`
- [ ] Le frontend est démarré : `npm run dev`

---

## 🆘 Commandes Utiles

```bash
# Tester la connexion MongoDB
cd server
node test-db-connection.js

# Lister tous les utilisateurs
cd server
node listUsers.js

# Créer un admin
cd server
npm run create:admin <email> <password>

# Promouvoir un utilisateur en admin
cd server
node makeUserAdmin.js <email>

# Démarrer le backend
cd server
node app.js

# Démarrer le frontend
npm run dev

# Générer Prisma Client
npx prisma generate

# Synchroniser le schéma
npx prisma db push

# Ouvrir Prisma Studio (interface graphique pour la DB)
npx prisma studio
```

---

## 📞 Besoin d'aide ?

Si les problèmes persistent :
1. Vérifiez les logs du backend dans `server/logs/`
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que tous les services sont démarrés
4. Vérifiez les fichiers `.env` sont correctement configurés
