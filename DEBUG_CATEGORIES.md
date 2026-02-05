# 🔍 Guide de Débogage - Problème des Catégories

## Problème Identifié

Les catégories ne s'affichent pas dans :
1. Le formulaire d'ajout de produit
2. La page de liste des catégories

Mais elles existent bien dans la base de données.

## Corrections Apportées

### 1. Page des Catégories (`app/(dashboard)/admin/categories/page.tsx`)

✅ **Corrigé** : Affichage de `category?.name` au lieu de `category?.title`
✅ **Ajouté** : Logs de débogage dans la console
✅ **Ajouté** : Messages d'erreur clairs
✅ **Ajouté** : Indicateur de chargement
✅ **Ajouté** : Message si aucune catégorie n'est trouvée

### 2. Formulaire d'ajout de produit (`app/(dashboard)/admin/products/new/page.tsx`)

✅ **Amélioré** : Logs de débogage détaillés
✅ **Corrigé** : Gestion des deux formats de réponse API
✅ **Ajouté** : Support de `category?.name` et `category?.title`

## Comment Déboguer

### Étape 1 : Vérifier la Console du Navigateur

1. Ouvrez la console (F12)
2. Allez sur la page des catégories ou le formulaire d'ajout de produit
3. Cherchez les logs qui commencent par :
   - `📦 Categories API response:`
   - `✅ Found X categories:`
   - `📋 Categories array:`

### Étape 2 : Vérifier la Réponse de l'API

1. Ouvrez l'onglet **Network** dans la console
2. Rechargez la page
3. Cherchez la requête vers `/api/categories`
4. Cliquez dessus et regardez la réponse

**Format attendu** :
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Nom de la catégorie"
    }
  ],
  "_debug": {
    "raw_category_count": 1,
    "prisma_findMany_count": 1,
    "connection_status": "OK"
  }
}
```

### Étape 3 : Vérifier la Base de Données

Exécutez ce script pour vérifier les catégories dans la base de données :

```bash
cd server
node scripts/check-categories.js
```

### Étape 4 : Vérifier le Serveur Backend

1. Assurez-vous que le serveur backend est démarré :
   ```bash
   cd server
   node app.js
   ```

2. Testez l'API directement :
   ```bash
   curl http://localhost:3001/api/categories
   ```

   Ou ouvrez dans le navigateur :
   ```
   http://localhost:3001/api/categories
   ```

## Problèmes Possibles et Solutions

### Problème 1 : `categories` est `undefined` ou `null`

**Cause** : L'API ne retourne pas le format attendu

**Solution** : Vérifiez que l'API backend retourne bien `{ categories: [...] }`

### Problème 2 : `categories` est un tableau vide `[]`

**Causes possibles** :
- Aucune catégorie dans la base de données
- Erreur de connexion à la base de données
- Erreur dans la requête Prisma

**Solutions** :
1. Vérifiez les logs du serveur backend
2. Créez une catégorie via `/admin/categories/new`
3. Vérifiez la connexion à MongoDB

### Problème 3 : Les catégories ont `name` mais le code cherche `title`

**Solution** : ✅ Déjà corrigé - Le code cherche maintenant `category?.name || category?.title`

### Problème 4 : Erreur CORS ou de connexion

**Symptômes** :
- Erreur dans la console : "Failed to fetch"
- Erreur : "Network error"

**Solutions** :
1. Vérifiez que le serveur backend est démarré
2. Vérifiez l'URL de l'API dans `.env` :
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```
3. Vérifiez que le port 3001 n'est pas utilisé par un autre processus

## Test Manuel

1. **Créer une catégorie** :
   - Allez sur `/admin/categories/new`
   - Créez une catégorie avec un nom (ex: "Test")
   - Vérifiez qu'elle est bien créée

2. **Vérifier l'affichage** :
   - Allez sur `/admin/categories`
   - La catégorie devrait apparaître dans le tableau

3. **Vérifier dans le formulaire** :
   - Allez sur `/admin/products/new`
   - Le select "Category" devrait contenir la catégorie créée

## Logs à Surveiller

Dans la console du navigateur, vous devriez voir :

```
📦 Categories API response: {categories: Array(1), _debug: {...}}
✅ Found 1 categories in data.categories
📋 Categories array: [{id: "...", name: "Test"}]
📋 First category example: {id: "...", name: "Test"}
```

Si vous voyez des erreurs, copiez-les et vérifiez :
- Le format de la réponse
- Les erreurs de connexion
- Les erreurs de parsing JSON

## Contact

Si le problème persiste après avoir suivi ce guide :
1. Copiez les logs de la console
2. Copiez la réponse de l'API (onglet Network)
3. Vérifiez les logs du serveur backend
