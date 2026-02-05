# 🚀 Guide de Démarrage du Backend

## ⚠️ Erreur : "Backend API non disponible"

Si vous voyez cette erreur, cela signifie que le serveur backend n'est pas démarré.

---

## 📋 Démarrage Rapide

### Étape 1 : Ouvrir un terminal

Ouvrez un **nouveau terminal** (gardez le terminal du frontend ouvert dans un autre).

### Étape 2 : Aller dans le dossier server

```bash
cd server
```

### Étape 3 : Démarrer le serveur backend

```bash
node app.js
```

Vous devriez voir :
```
✅ ========================================
✅ Serveur backend démarré sur le port 3001
✅ ========================================
🌐 URL: http://localhost:3001
📊 Health check: http://localhost:3001/health
```

---

## 🔍 Vérification

### Vérifier que le backend fonctionne

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3001/health`
3. Vous devriez voir : `{"status":"OK",...}`

### Vérifier la configuration

Assurez-vous que le fichier `server/.env` existe et contient :

```env
DATABASE_URL=mongodb://localhost:27017/votre-base-de-donnees
PORT=3001
```

---

## 🛠️ Dépannage

### Erreur : "Port 3001 déjà utilisé"

**Solution :**
1. Trouvez le processus qui utilise le port 3001
2. Arrêtez-le
3. Ou changez le port dans `server/.env` : `PORT=3002`

### Erreur : "DATABASE_URL n'est pas configuré"

**Solution :**
1. Créez un fichier `.env` dans le dossier `server/`
2. Ajoutez : `DATABASE_URL=mongodb://localhost:27017/votre-base-de-donnees`

### Erreur : "Cannot connect to MongoDB"

**Solution :**
1. Vérifiez que MongoDB est démarré
2. Vérifiez que l'URL de connexion est correcte
3. Vérifiez que MongoDB écoute sur le port 27017

---

## 📝 Commandes Utiles

### Démarrer le backend
```bash
cd server
node app.js
```

### Démarrer le backend en mode développement (avec auto-reload)
```bash
cd server
npm install nodemon --save-dev  # Si pas déjà installé
nodemon app.js
```

### Vérifier les logs
Les logs sont écrits dans : `server/logs/`

---

## 🎯 Workflow Complet

Pour développer, vous avez besoin de **2 terminaux** :

### Terminal 1 : Backend
```bash
cd server
node app.js
```

### Terminal 2 : Frontend
```bash
npm run dev
```

---

## ✅ Checklist

Avant de commencer à développer, vérifiez :

- [ ] MongoDB est démarré
- [ ] Le fichier `server/.env` existe avec `DATABASE_URL`
- [ ] Le backend est démarré (`node app.js` dans `server/`)
- [ ] Le frontend est démarré (`npm run dev` à la racine)
- [ ] Le backend répond sur `http://localhost:3001/health`

---

## 🚨 Important

**Le backend doit TOUJOURS être démarré** pour que l'application fonctionne correctement.

Si vous voyez l'erreur "Backend API non disponible", c'est que le backend n'est pas démarré.
