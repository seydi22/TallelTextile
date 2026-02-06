const prisma = require("../utills/db"); // ✅ Use shared connection

// Load cloudinary - try multiple paths for Vercel compatibility
let cloudinary;
try {
  // First try: root node_modules (Vercel structure)
  cloudinary = require('../../node_modules/cloudinary').v2;
} catch (e) {
  try {
    // Second try: relative path from server
    cloudinary = require('../../../node_modules/cloudinary').v2;
  } catch (e2) {
    try {
      // Third try: standard require (local dev or if installed in server/node_modules)
      cloudinary = require('cloudinary').v2;
    } catch (e3) {
      console.error('❌ Erreur: cloudinary n\'est pas installé');
      console.error('💡 Assurez-vous que cloudinary est dans les dependencies du package.json racine');
      throw new Error('cloudinary module not found. Please add it to package.json dependencies.');
    }
  }
}

// Configuration Cloudinary
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

  // Vérifier que Cloudinary est configuré
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary n'est pas configuré. Vérifiez les variables d'environnement.");
    return res.status(500).json({ 
      message: "Configuration Cloudinary manquante",
      error: "Les variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET doivent être configurées"
    });
  }

  try {
    // Upload vers Cloudinary en utilisant le buffer du fichier
    // Utiliser upload_stream pour éviter de créer un fichier temporaire
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'talel-textile', // Organiser les images dans un dossier
          resource_type: 'auto', // Détecte automatiquement le type (image, video, etc.)
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Envoyer le buffer du fichier au stream
      uploadStream.end(uploadedFile.data);
    });

    // Retourner l'URL complète de l'image Cloudinary
    // Le frontend pourra utiliser cette URL directement
    res.status(200).json({ 
      message: "Fichier téléchargé avec succès",
      filename: uploadResult.secure_url, // URL complète (https://res.cloudinary.com/...)
      public_id: uploadResult.public_id, // ID public pour référence future
      url: uploadResult.secure_url // Alias pour compatibilité
    });
  } catch (error) {
    console.error("Erreur lors de l'upload vers Cloudinary:", error);
    return res.status(500).json({ 
      message: "Erreur lors de l'upload du fichier", 
      error: error.message 
    });
  }
}

  module.exports = {
    uploadMainImage
};