/**
 * Utilitaires pour gérer les URLs d'images
 * Supporte à la fois les images locales (développement) et Cloudinary (production)
 */

/**
 * Retourne l'URL complète de l'image
 * Gère automatiquement les URLs Cloudinary (commençant par http/https) 
 * et les chemins locaux (commençant par /)
 * 
 * @param imagePath - Chemin de l'image (peut être une URL complète ou un chemin local)
 * @param fallback - Image de remplacement si imagePath est vide
 * @returns URL complète de l'image
 */
export function getImageUrl(imagePath: string | null | undefined, fallback: string = "/product_placeholder.jpg"): string {
  if (!imagePath) {
    return fallback;
  }

  // Si c'est déjà une URL complète (http:// ou https://), la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Sinon, c'est un chemin local, ajouter le préfixe /
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

/**
 * Vérifie si une image est hébergée sur Cloudinary
 * 
 * @param imagePath - Chemin ou URL de l'image
 * @returns true si l'image est sur Cloudinary
 */
export function isCloudinaryImage(imagePath: string | null | undefined): boolean {
  if (!imagePath) return false;
  return imagePath.includes('cloudinary.com') || imagePath.startsWith('http://') || imagePath.startsWith('https://');
}

/**
 * Extrait le public_id d'une URL Cloudinary
 * Utile pour les opérations de suppression ou de transformation
 * 
 * @param cloudinaryUrl - URL Cloudinary complète
 * @returns public_id ou null si ce n'est pas une URL Cloudinary valide
 */
export function extractCloudinaryPublicId(cloudinaryUrl: string): string | null {
  if (!isCloudinaryImage(cloudinaryUrl)) {
    return null;
  }

  try {
    // Les URLs Cloudinary ont le format :
    // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{version}/{public_id}.{format}
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return null;
    }

    // Le public_id est après 'upload' et les transformations
    // Format simplifié : prendre la dernière partie avant l'extension
    const lastPart = urlParts[urlParts.length - 1];
    const publicIdWithExt = lastPart.split('?')[0]; // Enlever les query params
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Enlever l'extension
    
    // Reconstruire le public_id complet avec le dossier si présent
    const pathAfterUpload = urlParts.slice(uploadIndex + 1, -1);
    if (pathAfterUpload.length > 0) {
      return `${pathAfterUpload.join('/')}/${publicId}`;
    }
    
    return publicId;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du public_id:', error);
    return null;
  }
}
