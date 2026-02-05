# Guide de Création d'un Compte Administrateur

Ce guide explique comment créer un compte administrateur pour accéder au dashboard admin.

## 📋 Prérequis

1. Assurez-vous que MongoDB est démarré et accessible
2. Vérifiez que le fichier `.env` existe dans le dossier `server/` avec la variable `DATABASE_URL` configurée
3. Assurez-vous que Prisma Client est généré : `npx prisma generate`

## 🚀 Méthode 1 : Utiliser le script npm (Recommandé)

Depuis le dossier `server/` :

```bash
cd server
npm run create:admin <email> <password>
```

**Exemple :**
```bash
npm run create:admin admin@example.com MonMotDePasse123!
```

## 🚀 Méthode 2 : Exécuter directement avec Node.js

Depuis le dossier `server/` :

```bash
cd server
node createAdminUser.js <email> <password>
```

**Exemple :**
```bash
node createAdminUser.js admin@example.com MonMotDePasse123!
```

## 📝 Exigences

- **Email** : Doit être un format d'email valide (ex: admin@example.com)
- **Mot de passe** : Doit contenir au moins 8 caractères

## ✅ Après la création

Une fois le compte créé, vous pouvez vous connecter à :
- **URL** : http://localhost:3000/login
- Utilisez l'email et le mot de passe que vous avez fournis

## ⚠️ Notes importantes

- Si un utilisateur avec cet email existe déjà, le script vous informera
- Si l'utilisateur existe mais n'est pas admin, utilisez `makeUserAdmin.js` pour le promouvoir
- Sauvegardez vos identifiants de manière sécurisée après la création

## 🔧 Dépannage

### Erreur : "DATABASE_URL n'est pas configuré"
- Vérifiez que le fichier `.env` existe dans `server/`
- Assurez-vous que `DATABASE_URL` est défini dans ce fichier

### Erreur : "User with email already exists"
- L'utilisateur existe déjà dans la base de données
- Si c'est un admin, vous pouvez vous connecter directement
- Si ce n'est pas un admin, utilisez `makeUserAdmin.js` pour le promouvoir
