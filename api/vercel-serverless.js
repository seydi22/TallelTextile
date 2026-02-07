/**
 * Wrapper pour convertir le serveur Express en Serverless Function Vercel
 * Ce fichier permet de déployer le backend Express sur Vercel
 */

const path = require('path');

// Charger les variables d'environnement (Vercel les fournit automatiquement, mais on charge aussi .env si présent)
try {
  require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
} catch (e) {
  // Ignorer si le fichier n'existe pas
}

try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {
  // Ignorer si le fichier n'existe pas
}

// Vérifier que DATABASE_URL est défini
if (!process.env.DATABASE_URL) {
  console.error('❌ Erreur: DATABASE_URL n\'est pas configuré');
  console.error('💡 Assurez-vous d\'avoir configuré DATABASE_URL dans les variables d\'environnement Vercel');
}

// S'assurer que Prisma Client est disponible (sans créer d'instance)
try {
  require('@prisma/client');
  console.log('✅ Prisma Client disponible');
} catch (prismaError) {
  console.error('❌ Erreur Prisma:', prismaError.message);
  console.error('💡 Assurez-vous que "prisma generate" a été exécuté dans le script de build');
}

// Importer l'application Express avec gestion d'erreur
let app;
try {
  app = require('../server/app');
  console.log('✅ Application Express chargée avec succès');
} catch (error) {
  console.error('❌ Erreur lors du chargement de l\'application Express:', error);
  console.error('Stack:', error.stack);
  // Créer une app Express minimale qui retourne une erreur
  const express = require('express');
  app = express();
  app.use((req, res) => {
    res.status(500).json({ 
      error: 'Server initialization failed', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : 'Check server logs'
    });
  });
}

// Export pour Vercel Serverless Functions
// Vercel attend un handler qui prend (req, res)
// Express app peut être utilisé directement comme handler
// Mais il faut s'assurer que le chemin de la requête est correct

// Wrapper pour logger les requêtes entrantes (debug)
const originalHandler = app;
const handler = (req, res) => {
  // Logger pour debug
  console.log(`[Vercel Handler] ${req.method} ${req.url}`);
  console.log(`[Vercel Handler] Original path: ${req.url}`);
  console.log(`[Vercel Handler] Pathname: ${req.path || req.url}`);
  
  // Vercel route /api/(.*) vers /api/vercel-serverless.js
  // Mais Express s'attend à recevoir le chemin complet
  // Si l'URL commence par /api/, on doit la garder telle quelle
  // Sinon, on doit peut-être l'ajuster
  
  // Passer la requête à Express
  return originalHandler(req, res);
};

module.exports = handler;
