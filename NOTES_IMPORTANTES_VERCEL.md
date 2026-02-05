# ⚠️ Notes Importantes pour Vercel

## 📸 Gestion des Images sur Vercel

### Problème

Sur Vercel, le système de fichiers est **en lecture seule** sauf pour le dossier `/tmp`. Cela signifie que vous **ne pouvez pas** sauvegarder des fichiers uploadés directement dans le dossier `public/` pendant l'exécution.

### Solutions Recommandées

#### Option 1 : Vercel Blob Storage (Recommandé)

Vercel offre un service de stockage d'objets intégré.

**Installation :**
```bash
npm install @vercel/blob
```

**Configuration :**
1. Allez sur [vercel.com](https://vercel.com)
2. Settings → Storage → Create Database → Blob
3. Notez votre `BLOB_READ_WRITE_TOKEN`

**Modification du code :**

```javascript
// server/controllers/mainImages.js
const { put } = require('@vercel/blob');

async function uploadMainImage(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
  }

  const uploadedFile = req.files.uploadedFile;
  
  try {
    // Upload vers Vercel Blob
    const blob = await put(uploadedFile.name, uploadedFile.data, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ 
      message: "Fichier téléchargé avec succès",
      filename: blob.url, // URL complète de l'image
      pathname: blob.pathname
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return res.status(500).json({ 
      message: "Erreur lors de l'upload du fichier", 
      error: error.message 
    });
  }
}
```

**Variables d'environnement à ajouter :**
```
BLOB_READ_WRITE_TOKEN=votre-token-vercel-blob
```

#### Option 2 : Cloudinary (Alternative populaire)

**Installation :**
```bash
npm install cloudinary
```

**Configuration :**
1. Créez un compte sur [cloudinary.com](https://cloudinary.com)
2. Récupérez vos credentials

**Modification du code :**

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadMainImage(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
  }

  const uploadedFile = req.files.uploadedFile;
  
  try {
    const result = await cloudinary.uploader.upload(uploadedFile.tempFilePath, {
      folder: 'talel-textile',
    });

    res.status(200).json({ 
      message: "Fichier téléchargé avec succès",
      filename: result.public_id,
      url: result.secure_url
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return res.status(500).json({ 
      message: "Erreur lors de l'upload du fichier", 
      error: error.message 
    });
  }
}
```

**Variables d'environnement :**
```
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

#### Option 3 : Solution temporaire (Développement uniquement)

Pour tester rapidement, vous pouvez utiliser `/tmp` (mais les fichiers seront supprimés après chaque déploiement) :

```javascript
const path = require('path');
const tmpPath = path.join('/tmp', uploadedFile.name);
uploadedFile.mv(tmpPath, (err) => {
  // ...
});
```

⚠️ **Attention :** Cette solution n'est **pas recommandée** pour la production car les fichiers seront perdus.

---

## 🔧 Autres Adaptations Nécessaires

### 1. Prisma sur Vercel

Prisma fonctionne bien sur Vercel, mais assurez-vous que :

1. **Le schéma Prisma est à la racine** : `prisma/schema.prisma`
2. **Génération Prisma dans le build** : Vérifiez que `package.json` contient :
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build"
     }
   }
   ```

### 2. Variables d'environnement

Toutes les variables doivent être ajoutées dans Vercel :
- Variables commençant par `NEXT_PUBLIC_` sont accessibles côté client
- Autres variables sont accessibles côté serveur uniquement

### 3. Timeout des fonctions

Par défaut, les Serverless Functions ont un timeout de 10 secondes (Hobby) ou 60 secondes (Pro).

Pour les uploads, vous pouvez augmenter dans `vercel.json` :
```json
{
  "functions": {
    "api/vercel-serverless.js": {
      "maxDuration": 30
    }
  }
}
```

### 4. Taille des fichiers

Limites sur Vercel :
- **Hobby** : 4.5 MB par fonction
- **Pro** : 50 MB par fonction

Pour les gros fichiers, utilisez un service de stockage externe.

---

## 📝 Checklist avant déploiement

- [ ] Variables d'environnement configurées
- [ ] CORS mis à jour avec URL Vercel
- [ ] Solution de stockage d'images choisie et configurée
- [ ] Prisma généré dans le build
- [ ] Tests locaux réussis
- [ ] Build local réussi : `npm run build`

---

## 🚀 Commandes utiles

```bash
# Déployer en production
vercel --prod

# Voir les logs
vercel logs

# Voir les variables d'environnement
vercel env ls

# Tester localement avec Vercel
vercel dev
```

---

## 📚 Ressources

- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
