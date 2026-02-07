const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

// Get a setting by key
const getSetting = asyncHandler(async (request, response) => {
  const { key } = request.params;

  try {
    const setting = await prisma.settings.findUnique({
      where: { key },
    });

    if (!setting) {
      return response.status(404).json({
        error: "Setting not found",
      });
    }

    return response.json(setting);
  } catch (error) {
    // Si le modèle Settings n'existe pas encore dans la base de données
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return response.status(404).json({
        error: "Setting not found",
      });
    }
    throw error;
  }
});

// Get all settings
const getAllSettings = asyncHandler(async (request, response) => {
  const settings = await prisma.settings.findMany({
    orderBy: { key: "asc" },
  });

  return response.json(settings);
});

// Create or update a setting
const upsertSetting = asyncHandler(async (request, response) => {
  const { key, value, description } = request.body;

  if (!key || value === undefined) {
    throw new AppError("Key and value are required", 400);
  }

  const setting = await prisma.settings.upsert({
    where: { key },
    update: {
      value,
      description: description || null,
    },
    create: {
      key,
      value,
      description: description || null,
    },
  });

  return response.status(200).json(setting);
});

// Delete a setting
const deleteSetting = asyncHandler(async (request, response) => {
  const { key } = request.params;

  const setting = await prisma.settings.findUnique({
    where: { key },
  });

  if (!setting) {
    throw new AppError("Setting not found", 404);
  }

  await prisma.settings.delete({
    where: { key },
  });

  return response.status(204).send();
});

module.exports = {
  getSetting,
  getAllSettings,
  upsertSetting,
  deleteSetting,
};
