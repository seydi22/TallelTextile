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

  // Récupérer l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user || !user.password) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Email ou mot de passe incorrect", 401);
  }

  // Retourner l'utilisateur sans le mot de passe
  return response.status(200).json(excludePassword(user));
});

module.exports = {
  login,
};
