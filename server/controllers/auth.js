const prisma = require("../utills/db");
const bcrypt = require("bcryptjs");
const { asyncHandler, AppError } = require("../utills/errorHandler");

// Helper function to exclude password from user object
function excludePassword(user) {
  if (!user) return user;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  // Validation
  if (!email || !password) {
    throw new AppError("Email et mot de passe requis", 400);
  }

  // Normaliser l'email (trim et lowercase)
  const normalizedEmail = email.trim().toLowerCase();
  console.log(`[Auth] Tentative de connexion avec email: "${normalizedEmail}"`);

  // Récupérer l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  console.log(`[Auth] Utilisateur trouvé:`, user ? { id: user.id, email: user.email, hasPassword: !!user.password } : 'null');

  if (!user) {
    console.log(`[Auth] Utilisateur non trouvé pour l'email: "${normalizedEmail}"`);
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  if (!user.password) {
    console.log(`[Auth] Utilisateur trouvé mais pas de mot de passe pour l'email: "${normalizedEmail}"`);
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  // Vérifier le mot de passe
  console.log(`[Auth] Comparaison du mot de passe...`);
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    console.log(`[Auth] Mot de passe incorrect pour l'email: "${normalizedEmail}"`);
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  console.log(`[Auth] Connexion réussie pour l'utilisateur: ${user.email}`);
  // Retourner l'utilisateur sans le mot de passe
  return response.status(200).json(excludePassword(user));
});

module.exports = {
  login,
};
