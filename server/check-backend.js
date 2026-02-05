// Script de vérification du backend
// Vérifie que toutes les conditions sont remplies pour démarrer le backend

const path = require('path');
const fs = require('fs');

console.log('🔍 Vérification du backend...\n');

let hasErrors = false;

// 1. Vérifier que le fichier .env existe
console.log('1️⃣  Vérification du fichier .env...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ Fichier .env trouvé');
  
  // Lire et vérifier DATABASE_URL
  require('dotenv').config({ path: envPath });
  if (process.env.DATABASE_URL) {
    console.log('   ✅ DATABASE_URL est configuré');
    console.log(`   📍 URL: ${process.env.DATABASE_URL.substring(0, 30)}...`);
  } else {
    console.log('   ❌ DATABASE_URL n\'est pas configuré dans .env');
    hasErrors = true;
  }
} else {
  console.log('   ❌ Fichier .env non trouvé dans server/');
  console.log('   💡 Créez un fichier .env avec DATABASE_URL');
  hasErrors = true;
}

// 2. Vérifier que node_modules existe
console.log('\n2️⃣  Vérification des dépendances...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules trouvé');
  
  // Vérifier quelques dépendances critiques
  const criticalDeps = ['express', '@prisma/client', 'bcryptjs', 'cors'];
  let missingDeps = [];
  
  criticalDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (!fs.existsSync(depPath)) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    console.log('   ✅ Toutes les dépendances critiques sont installées');
  } else {
    console.log(`   ⚠️  Dépendances manquantes: ${missingDeps.join(', ')}`);
    console.log('   💡 Exécutez: npm install');
    hasErrors = true;
  }
} else {
  console.log('   ❌ node_modules non trouvé');
  console.log('   💡 Exécutez: npm install');
  hasErrors = true;
}

// 3. Vérifier que Prisma Client est généré
console.log('\n3️⃣  Vérification de Prisma Client...');
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('   ✅ Prisma Client est disponible');
} catch (error) {
  console.log('   ❌ Prisma Client n\'est pas généré');
  console.log('   💡 Exécutez: npx prisma generate');
  hasErrors = true;
}

// 4. Vérifier que le fichier app.js existe
console.log('\n4️⃣  Vérification du fichier app.js...');
const appJsPath = path.join(__dirname, 'app.js');
if (fs.existsSync(appJsPath)) {
  console.log('   ✅ app.js trouvé');
} else {
  console.log('   ❌ app.js non trouvé');
  hasErrors = true;
}

// 5. Vérifier la connexion MongoDB (si DATABASE_URL est configuré)
if (process.env.DATABASE_URL) {
  console.log('\n5️⃣  Test de connexion MongoDB...');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test simple de connexion
    prisma.$connect()
      .then(() => {
        console.log('   ✅ Connexion MongoDB réussie');
        return prisma.$disconnect();
      })
      .then(() => {
        console.log('\n✅ Toutes les vérifications sont passées!');
        console.log('🚀 Vous pouvez démarrer le backend avec: npm start\n');
      })
      .catch((error) => {
        console.log('   ❌ Erreur de connexion MongoDB:');
        console.log(`   ${error.message}`);
        console.log('\n💡 Solutions:');
        console.log('   1. Vérifiez que MongoDB est démarré');
        console.log('   2. Vérifiez que DATABASE_URL est correct');
        console.log('   3. Vérifiez que le port 27017 n\'est pas bloqué\n');
        hasErrors = true;
      });
  } catch (error) {
    console.log('   ⚠️  Impossible de tester la connexion (Prisma Client non disponible)');
  }
} else {
  console.log('\n5️⃣  Test de connexion MongoDB...');
  console.log('   ⏭️  Ignoré (DATABASE_URL non configuré)');
}

// Résumé
if (hasErrors) {
  console.log('\n❌ Certaines vérifications ont échoué.');
  console.log('💡 Corrigez les erreurs ci-dessus avant de démarrer le backend.\n');
  process.exit(1);
}
