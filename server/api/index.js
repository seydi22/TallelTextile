/**
 * Wrapper pour convertir le serveur Express en Serverless Function Vercel
 * Ce fichier est utilisé quand le backend est déployé comme projet séparé depuis server/
 */

const path = require('path');

// Charger les variables d'environnement
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

// S'assurer que Prisma Client est disponible
try {
  require('@prisma/client');
  console.log('✅ Prisma Client disponible');
} catch (prismaError) {
  console.error('❌ Erreur Prisma:', prismaError.message);
  console.error('💡 Assurez-vous que "prisma generate" a été exécuté dans le script de build');
}

// Importer l'application Express
let app;
try {
  app = require('../app');
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
module.exports = app;