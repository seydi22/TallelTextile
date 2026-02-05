# 📸 Guide Complet - Gestion des Images de Produits

## 🎯 Vue d'ensemble

Ce guide explique comment fonctionne le système de gestion des images dans l'application, comment ajouter des produits avec des images, et comment utiliser le bulk upload.

---

## 📤 1. Ajout d'un Produit avec Image (Méthode Manuelle)

### Comment ça fonctionne :

1. **Upload de l'image** :
   - L'utilisateur sélectionne un fichier image dans le formulaire
   - Le fichier est envoyé au serveur via l'endpoint `/api/main-image`
   - Le serveur sauvegarde l'image dans le dossier `public/` du projet
   - Le serveur retourne le nom du fichier sauvegardé

2. **Création du produit** :
   - Le nom du fichier retourné est stocké dans le champ `mainImage` du produit
   - Le produit est créé avec ce nom d'image dans la base de données

### Structure des fichiers :

```
Projet/
├── public/              # Dossier où les images sont sauvegardées
│   ├── logo.png
│   ├── product1.jpg
│   └── ...
├── server/
│   └── controllers/
│       └── mainImages.js  # Contrôleur qui gère l'upload
└── app/
    └── (dashboard)/
        └── admin/
            └── products/
                └── new/
                    └── page.tsx  # Formulaire d'ajout de produit
```

### Code de l'upload (côté serveur) :

```javascript
// server/controllers/mainImages.js
async function uploadMainImage(req, res) {
    // Récupère le fichier uploadé
    const uploadedFile = req.files.uploadedFile;
    
    // Sauvegarde dans ../public/ (un niveau au-dessus du dossier server)
    uploadedFile.mv('../public/' + uploadedFile.name, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Retourne le nom du fichier pour que le frontend puisse l'utiliser
        res.status(200).json({ 
            message: "Fichier téléchargé avec succès",
            filename: uploadedFile.name 
        });
    });
}
```

### Code de l'upload (côté frontend) :

```typescript
// app/(dashboard)/admin/products/new/page.tsx
const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${apiBaseUrl}/api/main-image`, {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        // Met à jour le produit avec le nom du fichier retourné
        setProduct({ ...product, mainImage: data.filename });
    }
};
```

### Affichage de l'image :

Les images sont affichées en ajoutant `/` devant le nom du fichier :

```tsx
<Image
    src={`/${product.mainImage}`}
    alt={product.title}
    width={500}
    height={500}
/>
```

**Important** : Le champ `mainImage` dans la base de données contient uniquement le nom du fichier (ex: `"product1.jpg"`), pas le chemin complet.

---

## 📦 2. Bulk Upload (Import en Masse)

### Comment ça fonctionne :

Le bulk upload permet d'importer plusieurs produits à la fois via un fichier CSV.

### Format du CSV :

Le fichier CSV doit contenir les colonnes suivantes :

```csv
title,price,manufacturer,inStock,mainImage,description,slug,categoryId
```

### Exemple de CSV :

```csv
title,price,manufacturer,inStock,mainImage,description,slug,categoryId
T-shirt Blanc,29.99,TALLEL TEXTILE,50,https://example.com/tshirt.jpg,"T-shirt en coton bio, confortable et durable",tshirt-blanc,cat-uuid-123
Pantalon Noir,79.99,TALLEL TEXTILE,30,https://example.com/pantalon.jpg,"Pantalon élégant en lin, parfait pour toutes occasions",pantalon-noir,cat-uuid-123
```

### ⚠️ Important pour les Images dans le Bulk Upload :

**Les images dans le bulk upload doivent être des URLs**, pas des fichiers locaux !

- ✅ **Correct** : `https://example.com/image.jpg`
- ✅ **Correct** : `https://unsplash.com/photos/abc123`
- ❌ **Incorrect** : `image.jpg` (fichier local)
- ❌ **Incorrect** : `/public/image.jpg`

### Pourquoi des URLs ?

Le bulk upload ne télécharge pas les fichiers. Il utilise directement les URLs fournies dans le CSV. Si vous voulez utiliser vos propres images :

1. **Option 1** : Uploader les images sur un service cloud (Cloudinary, AWS S3, etc.) et utiliser les URLs
2. **Option 2** : Uploader les images manuellement dans le dossier `public/` et utiliser les URLs complètes
3. **Option 3** : Utiliser des services d'images gratuits comme Unsplash

### Comment utiliser le Bulk Upload :

1. **Via l'interface admin** :
   - Aller sur `/admin/bulk-upload`
   - Télécharger le template CSV
   - Remplir le CSV avec vos produits
   - Uploader le fichier CSV
   - Voir les résultats

2. **Via l'API** :
```bash
curl -X POST http://localhost:3001/api/bulk-upload \
  -F "file=@votre-fichier.csv"
```

### Colonnes du CSV :

| Colonne | Obligatoire | Type | Description | Exemple |
|---------|-------------|------|-------------|---------|
| `title` | ✅ Oui | String | Nom du produit | "T-shirt Blanc" |
| `price` | ✅ Oui | Number | Prix (avec point pour décimal) | 29.99 |
| `manufacturer` | ✅ Oui | String | Fabricant | "TALLEL TEXTILE" |
| `inStock` | ❌ Non | Number | Stock disponible | 50 |
| `mainImage` | ❌ Non | URL | URL de l'image | "https://example.com/img.jpg" |
| `description` | ✅ Oui | String | Description | "T-shirt en coton..." |
| `slug` | ✅ Oui | String | Identifiant URL-friendly | "tshirt-blanc" |
| `categoryId` | ✅ Oui | String | ID ou nom de catégorie | "cat-uuid-123" |

---

## 🌐 3. Hébergement en Production

### ⚠️ Problème Actuel :

Actuellement, les images sont sauvegardées **localement** dans le dossier `public/`. Cela fonctionne en développement, mais pose des problèmes en production :

1. **Les images ne persistent pas** : Si le serveur redémarre ou change, les images sont perdues
2. **Pas de sauvegarde** : Les images ne sont pas sauvegardées automatiquement
3. **Performance** : Servir les images depuis le serveur n'est pas optimal

### ✅ Solution Recommandée : Stockage Cloud

Pour la production, vous devriez utiliser un service de stockage cloud :

#### Option 1 : Cloudinary (Recommandé - Gratuit jusqu'à 25GB)

1. Créer un compte sur [Cloudinary](https://cloudinary.com)
2. Installer le SDK :
```bash
npm install cloudinary
```

3. Modifier le contrôleur d'upload :
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadMainImage(req, res) {
    const uploadedFile = req.files.uploadedFile;
    
    // Upload vers Cloudinary
    cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            
            // Retourne l'URL de l'image sur Cloudinary
            res.status(200).json({ 
                message: "Fichier téléchargé avec succès",
                filename: result.secure_url  // URL complète de l'image
            });
        }
    ).end(uploadedFile.data);
}
```

#### Option 2 : AWS S3

1. Créer un bucket S3 sur AWS
2. Installer le SDK :
```bash
npm install aws-sdk
```

3. Configurer l'upload vers S3

#### Option 3 : Vercel Blob Storage

Si vous hébergez sur Vercel, utilisez leur service de stockage.

### Modification du Frontend pour les URLs Complètes :

Si vous utilisez un service cloud, les images retournées seront des URLs complètes (ex: `https://res.cloudinary.com/...`). Dans ce cas, modifiez l'affichage :

```tsx
<Image
    src={product.mainImage.startsWith('http') 
        ? product.mainImage 
        : `/${product.mainImage}`
    }
    alt={product.title}
    width={500}
    height={500}
/>
```

---

## 🔧 4. Dépannage

### Problème : L'image ne s'affiche pas après l'upload

**Solutions** :
1. Vérifier que le fichier est bien sauvegardé dans `public/`
2. Vérifier que le nom du fichier dans la base de données correspond au fichier
3. Vérifier les permissions du dossier `public/`
4. Vérifier la console du navigateur pour les erreurs 404

### Problème : L'upload échoue

**Solutions** :
1. Vérifier que le serveur backend est démarré
2. Vérifier que le dossier `public/` existe
3. Vérifier les permissions d'écriture
4. Vérifier la taille du fichier (limite par défaut : 50MB)

### Problème : Les images du bulk upload ne s'affichent pas

**Solutions** :
1. Vérifier que les URLs dans le CSV sont valides
2. Vérifier que les URLs commencent par `http://` ou `https://`
3. Tester les URLs dans un navigateur
4. Vérifier que les images ne sont pas bloquées par CORS

---

## 📝 5. Checklist pour Ajouter un Produit

- [ ] Image uploadée avec succès (message de confirmation)
- [ ] Nom du fichier visible dans le champ `mainImage`
- [ ] Aperçu de l'image visible dans le formulaire
- [ ] Produit créé avec succès
- [ ] Image visible sur la page du produit
- [ ] Image visible dans la liste des produits

---

## 🚀 6. Prochaines Étapes Recommandées

1. **Implémenter le stockage cloud** pour la production
2. **Ajouter la compression d'images** avant l'upload
3. **Ajouter la validation des types de fichiers** (seulement jpg, png, webp)
4. **Ajouter la validation de la taille** des fichiers
5. **Ajouter le redimensionnement automatique** des images
6. **Ajouter la génération de thumbnails**

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs du serveur dans `server/logs/`
2. Vérifier la console du navigateur
3. Vérifier que toutes les dépendances sont installées
4. Vérifier les variables d'environnement
