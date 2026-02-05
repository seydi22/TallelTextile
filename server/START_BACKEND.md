# 🚀 Guide de Démarrage du Backend

Ce guide explique comment démarrer le serveur backend API.

## 📋 Prérequis

1. **MongoDB doit être démarré**
   - Windows : Vérifiez que le service MongoDB est démarré
   - macOS/Linux : Exécutez `mongod` dans un terminal

2. **Fichier `.env` configuré**
   - Le fichier `server/.env` doit contenir `DATABASE_URL`
   - Exemple : `DATABASE_URL="mongodb://localhost:27017/singitronic_nextjs"`

3. **Dépendances installées**
   ```bash
   cd server
   npm install
   ```

4. **Prisma Client généré**
   ```bash
   npx prisma generate
   ```

## 🚀 Démarrage du Backend

### Méthode 1 : Avec npm (Recommandé)

```bash
cd server
npm start
```

### Méthode 2 : Directement avec Node.js

```bash
cd server
node app.js
```

## ✅ Vérification

Une fois démarré, vous devriez voir :

```
✅ ========================================
✅ Serveur backend démarré sur le port 3001
✅ ========================================
🌐 URL: http://localhost:3001
📊 Health check: http://localhost:3001/health
🔒 Rate limiting et logging activés
📝 Logs écrits dans: server/logs/
✅ ========================================
```

### Tester la connexion

Ouvrez dans votre navigateur :
- **Health check** : http://localhost:3001/health
- Vous devriez voir : `{"status":"OK","timestamp":"...","rateLimiting":"enabled"}`

## ⚠️ Problèmes Courants

### Erreur : "DATABASE_URL n'est pas configuré"

**Solution :**
1. Créez un fichier `.env` dans le dossier `server/`
2. Ajoutez : `DATABASE_URL="mongodb://localhost:27017/singitronic_nextjs"`
3. Redémarrez le serveur

### Erreur : "Le port 3001 est déjà utilisé"

**Solution 1 : Arrêter le processus**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill
```

**Solution 2 : Changer le port**
Dans `server/.env`, ajoutez :
```env
PORT=3002
```

### Erreur : "MongoDB connection failed"

**Solution :**
1. Vérifiez que MongoDB est démarré
2. Vérifiez que `DATABASE_URL` est correct dans `server/.env`
3. Testez la connexion : `node test-db-connection.js`

## 📝 Logs

Les logs sont écrits dans `server/logs/` :
- `access.log` : Toutes les requêtes
- `error.log` : Erreurs 4xx et 5xx
- `security.log` : Tentatives suspectes

Pour voir les logs :
```bash
cd server
npm run logs          # Tous les logs
npm run logs:access    # Logs d'accès
npm run logs:error     # Logs d'erreur
npm run logs:security  # Logs de sécurité
```

## 🔄 Redémarrage

Pour redémarrer le serveur :
1. Arrêtez avec `Ctrl+C`
2. Relancez avec `npm start` ou `node app.js`

## 🌐 Endpoints Disponibles

Une fois démarré, le backend expose :
- `/api/products` - Gestion des produits
- `/api/categories` - Gestion des catégories
- `/api/users` - Gestion des utilisateurs
- `/api/merchants` - Gestion des marchands
- `/api/orders` - Gestion des commandes
- `/api/search` - Recherche
- `/health` - Health check
- `/rate-limit-info` - Informations sur les limites de taux

## 💡 Astuce

Pour démarrer automatiquement le backend avec le frontend, vous pouvez utiliser un outil comme `concurrently` :

```bash
npm install -g concurrently
concurrently "cd server && npm start" "npm run dev"
```
