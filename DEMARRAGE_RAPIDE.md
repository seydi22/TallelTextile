# 🚀 Guide de Démarrage Rapide

## ⚡ Démarrage en 3 étapes

### Étape 0 : Vérifier le Backend (Recommandé)

Avant de démarrer, vérifiez que tout est prêt :

```bash
cd server
npm run check
```

Ce script vérifie :
- ✅ Fichier `.env` avec `DATABASE_URL`
- ✅ Dépendances installées
- ✅ Prisma Client généré
- ✅ Connexion MongoDB

### Étape 1 : Vérifier MongoDB

**Windows :**
- Ouvrez le Gestionnaire de services (services.msc)
- Vérifiez que le service "MongoDB" est démarré

**macOS/Linux :**
```bash
# Vérifier si MongoDB tourne
ps aux | grep mongod

# Si non, démarrer MongoDB
mongod
```

### Étape 2 : Démarrer le Backend (Terminal 1)

```bash
cd server
node app.js
```

✅ Vous devriez voir : `Server running on port 3001`

### Étape 3 : Démarrer le Frontend (Terminal 2)

```bash
# Depuis la racine du projet
npm run dev
```

✅ Vous devriez voir : `ready started server on 0.0.0.0:3000`

---

## 🔐 Créer un compte admin (si nécessaire)

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

---

## 🌐 Accès à l'application

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:3001
- **Login Admin :** http://localhost:3000/login

---

## ⚠️ Problèmes courants

### Erreur "fetch failed"
→ Le backend n'est pas démarré. Vérifiez l'Étape 2.

### Erreur de connexion MongoDB
→ MongoDB n'est pas démarré. Vérifiez l'Étape 1.

### Erreur lors de la création d'admin
→ Vérifiez que MongoDB est démarré et que `DATABASE_URL` est correct dans `server/.env`

Pour plus de détails, consultez `TROUBLESHOOTING.md`
