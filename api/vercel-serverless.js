/**
 * Wrapper pour convertir le serveur Express en Serverless Function Vercel
 * Ce fichier permet de déployer le backend Express sur Vercel
 */

const express = require('express');
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Importer l'application Express
const app = require('../server/app');

// Export pour Vercel Serverless Functions
module.exports = app;
