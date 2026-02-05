/**
 * EXEMPLE : Version compatible Vercel pour mainImages.js
 * 
 * Ce fichier montre comment adapter uploadMainImage pour utiliser Vercel Blob Storage
 * 
 * INSTRUCTIONS :
 * 1. Installer @vercel/blob : npm install @vercel/blob
 * 2. Configurer BLOB_READ_WRITE_TOKEN dans Vercel Dashboard
 * 3. Remplacer le contenu de server/controllers/mainImages.js par ce code
 */

const { put } = require('@vercel/blob');

async function uploadMainImage(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
  }

  const uploadedFile = req.files.uploadedFile;
  
  try {
    // Vérifier que le token est configuré
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN n'est pas configuré");
      return res.status(500).json({ 
        message: "Configuration manquante pour le stockage d'images",
        error: "BLOB_READ_WRITE_TOKEN non configuré"
      });
    }

    // Upload vers Vercel Blob Storage
    const blob = await put(uploadedFile.name, uploadedFile.data, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Retourner l'URL complète de l'image
    // Note: Le frontend devra peut-être être adapté pour utiliser blob.url au lieu de blob.pathname
    res.status(200).json({ 
      message: "Fichier téléchargé avec succès",
      filename: blob.url, // URL complète de l'image (ex: https://xxx.public.blob.vercel-storage.com/image.jpg)
      pathname: blob.pathname, // Chemin relatif (ex: image.jpg)
      url: blob.url // Alias pour compatibilité
    });
  } catch (error) {
    console.error("Erreur lors de l'upload vers Vercel Blob:", error);
    return res.status(500).json({ 
      message: "Erreur lors de l'upload du fichier", 
      error: error.message 
    });
  }
}

module.exports = {
  uploadMainImage
};
