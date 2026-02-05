// Script pour créer un compte administrateur
// Usage: node createAdminUser.js <email> <password>
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Charger les variables d'environnement (essayer d'abord server/.env, puis .env à la racine)
try {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
} catch (e) {
  // Ignorer si dotenv n'est pas installé
}
try {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
} catch (e) {
  // Ignorer si dotenv n'est pas installé
}

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Vérifier que DATABASE_URL est configuré
    if (!process.env.DATABASE_URL) {
      console.error("❌ Erreur: DATABASE_URL n'est pas configuré dans le fichier .env");
      console.log("💡 Assurez-vous d'avoir un fichier .env dans le dossier server/ avec DATABASE_URL");
      process.exit(1);
    }

    // Récupérer les identifiants depuis la ligne de commande
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.log("❌ Veuillez fournir un email et un mot de passe.");
      console.log("\nUsage: node createAdminUser.js <email> <password>");
      console.log("\nExemple:");
      console.log("  node createAdminUser.js admin@example.com MonMotDePasse123!");
      process.exit(1);
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Format d'email invalide");
      process.exit(1);
    }

    // Validation du mot de passe
    if (password.length < 8) {
      console.error("❌ Le mot de passe doit contenir au moins 8 caractères");
      process.exit(1);
    }

    console.log("🔐 Création du compte administrateur...\n");

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log(`⚠️  Un utilisateur avec l'email "${email}" existe déjà!`);

      if (existingUser.role === "admin") {
        console.log("ℹ️  Cet utilisateur est déjà un administrateur. 👑\n");
      } else {
        console.log("💡 Utilisez makeUserAdmin.js pour promouvoir cet utilisateur en admin.\n");
      }

      process.exit(1);
    }

    // Hasher le mot de passe (utiliser 14 rounds comme dans le contrôleur)
    const hashedPassword = await bcrypt.hash(password, 14);

    // Créer l'utilisateur admin (MongoDB génère automatiquement l'ID)
    const adminUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ SUCCÈS! Compte administrateur créé! 👑\n");
    console.log("Identifiants administrateur:");
    console.log("─".repeat(50));
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Rôle:     ${adminUser.role}`);
    console.log(`  ID:       ${adminUser.id}`);
    console.log("─".repeat(50));
    console.log("\n🎉 Vous pouvez maintenant vous connecter avec ces identifiants!");
    console.log("🌐 URL de connexion: http://localhost:3000/login");
    console.log("\n⚠️  IMPORTANT: Veuillez sauvegarder ces identifiants de manière sécurisée!\n");
  } catch (error) {
    console.error("❌ Erreur lors de la création du compte administrateur:");
    console.error(error.message);
    
    // Gestion spécifique des erreurs de connexion
    if (error.message && error.message.includes("DNS resolution")) {
      console.error("\n🔍 Diagnostic:");
      console.error("   - MongoDB n'est pas accessible");
      console.error("   - Vérifiez que MongoDB est démarré");
      console.error("   - Vérifiez que DATABASE_URL dans .env est correct");
      console.error("\n💡 Solutions:");
      console.error("   1. Démarrer MongoDB:");
      console.error("      - Windows: Vérifiez le service MongoDB dans les services Windows");
      console.error("      - macOS/Linux: Exécutez 'mongod' dans un terminal");
      console.error("   2. Vérifier DATABASE_URL dans server/.env:");
      console.error("      DATABASE_URL=\"mongodb://localhost:27017/singitronic_nextjs\"");
      console.error("   3. Tester la connexion:");
      console.error("      node test-db-connection.js");
    } else if (error.code === "P2002") {
      console.error("\n💡 Cette erreur indique qu'un utilisateur avec cet email existe déjà.");
    } else if (error.message && error.message.includes("Can't reach database server")) {
      console.error("\n🔍 MongoDB n'est pas accessible. Vérifiez:");
      console.error("   - Que MongoDB est démarré");
      console.error("   - Que le port 27017 n'est pas bloqué par un firewall");
      console.error("   - Que DATABASE_URL est correct dans server/.env");
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
