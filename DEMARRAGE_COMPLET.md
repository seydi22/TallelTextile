# 🚀 Guide de Démarrage Complet - Talel Textile

Ce guide vous explique comment démarrer l'application complète (frontend + backend).

## 📋 Prérequis

1. **MongoDB** doit être démarré
2. **Node.js** installé (version 18+)
3. **Fichiers `.env`** configurés

## 🚀 Démarrage en 3 étapes

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
npm start
```

✅ Vous devriez voir :
```
✅ ========================================
✅ Serveur backend démarré sur le port 3001
✅ ========================================
🌐 URL: http://localhost:3001
📊 Health check: http://localhost:3001/health
```

### Étape 3 : Démarrer le Frontend (Terminal 2)

```bash
# Depuis la racine du projet
npm run dev
```

✅ Vous devriez voir :
```
- ready started server on 0.0.0.0:3000
```

## 🌐 Accès à l'application

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:3001
- **Health Check :** http://localhost:3001/health
- **Login Admin :** http://localhost:3000/login

## ⚠️ Problèmes Courants

### Le backend ne démarre pas

**Vérifiez :**
1. MongoDB est démarré
2. Le fichier `server/.env` existe avec `DATABASE_URL`
3. Les dépendances sont installées : `cd server && npm install`

### Le frontend affiche "fetch failed"

**Solution :** Le backend n'est pas démarré. Vérifiez l'Étape 2.

### Erreur "Port already in use"

**Solution :**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill
```

## 📝 Commandes Utiles

```bash
# Démarrer le backend
cd server && npm start

# Démarrer le frontend
npm run dev

# Créer un admin
cd server && npm run create:admin admin@example.com MotDePasse123!

# Voir les logs du backend
cd server && npm run logs
```

## 💡 Astuce : Démarrage Automatique

Pour démarrer les deux serveurs en même temps, installez `concurrently` :

```bash
npm install -g concurrently
```

Puis créez un script dans `package.json` :
```json
"scripts": {
  "dev:all": "concurrently \"cd server && npm start\" \"npm run dev\""
}
```

Ensuite :
```bash
npm run dev:all
```

---

Pour plus de détails, consultez :
- `server/START_BACKEND.md` - Guide détaillé du backend
- `TROUBLESHOOTING.md` - Guide de dépannage complet
