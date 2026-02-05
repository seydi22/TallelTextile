# 📸 Guide - Ajout d'Images aux Catégories

## ✅ Modifications Apportées

### 1. Schéma Prisma
- Ajout du champ `image` (optionnel) au modèle `Category` dans les deux fichiers schema.prisma

### 2. Formulaire d'Ajout de Catégorie
- Ajout d'un champ pour uploader l'image
- Aperçu de l'image avant création
- Utilisation de l'API `/api/main-image` pour l'upload

### 3. Formulaire d'Édition de Catégorie
- Ajout d'un champ pour modifier l'image
- Affichage de l'image actuelle
- Possibilité de changer l'image

### 4. Contrôleur Backend
- `createCategory` : Accepte maintenant le champ `image`
- `updateCategory` : Peut mettre à jour l'image

### 5. API Next.js
- Retourne maintenant l'image de la catégorie au lieu du placeholder

## 🚀 Étapes pour Appliquer les Changements

### Étape 1 : Régénérer le Client Prisma

Puisque nous avons modifié le schéma Prisma, il faut régénérer le client :

```bash
# Dans le dossier server
cd server
npx prisma generate

# Et aussi dans le dossier racine (si vous avez deux schémas)
cd ..
npx prisma generate
```

### Étape 2 : Redémarrer le Serveur Backend

```bash
cd server
node app.js
```

### Étape 3 : Tester

1. **Créer une nouvelle catégorie avec image** :
   - Allez sur `/admin/categories/new`
   - Entrez un nom
   - Uploadez une image
   - Créez la catégorie

2. **Vérifier l'affichage** :
   - Allez sur la page d'accueil
   - La section "Nos Univers" devrait afficher les images des catégories

3. **Modifier une catégorie existante** :
   - Allez sur `/admin/categories/[id]`
   - Uploadez une nouvelle image
   - Mettez à jour

## 📝 Notes Importantes

### Pour les Catégories Existantes

Les catégories existantes n'ont pas d'image. Elles utiliseront le placeholder `/product_placeholder.jpg` jusqu'à ce que vous leur ajoutiez une image.

### Format des Images

- Formats acceptés : JPG, PNG, WebP
- Les images sont sauvegardées dans le dossier `public/`
- Le nom du fichier est stocké dans la base de données

### Migration MongoDB

Avec MongoDB, pas besoin de migration explicite. Le champ `image` sera automatiquement ajouté aux nouveaux documents. Pour les documents existants, le champ sera `null` ou `undefined`.

## 🔧 Dépannage

### Les images ne s'affichent pas

1. Vérifiez que le fichier est bien dans `public/`
2. Vérifiez que le nom du fichier dans la base de données correspond
3. Vérifiez la console du navigateur pour les erreurs 404

### Erreur Prisma

Si vous avez une erreur Prisma, régénérez le client :
```bash
npx prisma generate
```

### L'image ne s'upload pas

1. Vérifiez que le serveur backend est démarré
2. Vérifiez les logs du serveur
3. Vérifiez les permissions du dossier `public/`
