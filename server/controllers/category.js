const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const createCategory = asyncHandler(async (request, response) => {
  const { name, image } = request.body;

  console.log("🔨 [createCategory] Request received:", { name, image });

  if (!name || name.trim().length === 0) {
    throw new AppError("Category name is required", 400);
  }

  const trimmedName = name.trim();
  const imagePath = image && image.trim().length > 0 ? image.trim() : null;
  
  console.log("🔨 [createCategory] Creating category with name:", trimmedName, "image:", imagePath);

  try {
    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        image: imagePath,
      },
    });
    
    console.log("✅ [createCategory] Category created successfully:", { id: category.id, name: category.name, image: category.image });
    
    // Vérifier que la catégorie a bien été créée
    const verifyCategory = await prisma.category.findUnique({
      where: { id: category.id }
    });
    console.log("🔍 [createCategory] Verification - Category exists:", !!verifyCategory);
    
    return response.status(201).json(category);
  } catch (error) {
    console.error("❌ [createCategory] Error creating category:", error);
    throw error;
  }
});

const updateCategory = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { name, image } = request.body;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  if (!name || name.trim().length === 0) {
    throw new AppError("Category name is required", 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const updateData = {
    name: name.trim(),
  };

  // Only update image if provided
  if (image !== undefined) {
    updateData.image = image && image.trim().length > 0 ? image.trim() : null;
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: existingCategory.id,
    },
    data: updateData,
  });

  return response.status(200).json(updatedCategory);
});

const deleteCategory = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  // Check if category has products
  const productsWithCategory = await prisma.product.findFirst({
    where: {
      categoryId: id,
    },
  });

  if (productsWithCategory) {
    throw new AppError("Cannot delete category that has products", 400);
  }

  await prisma.category.delete({
    where: {
      id: id,
    },
  });
  return response.status(204).send();
});

const getCategory = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  
  return response.status(200).json(category);
});

const getAllCategories = asyncHandler(async (request, response) => {
  console.log("🔍 [getAllCategories] Starting category fetch...");
  console.log("🔍 [getAllCategories] DATABASE_URL is set:", !!process.env.DATABASE_URL);
  
  let categories = [];
  try {
    // Tester la connexion Prisma
    console.log("🔍 [getAllCategories] Testing Prisma connection...");
    
    // MongoDB doesn't support $queryRaw with SQL syntax
    // Use count() instead for MongoDB
    const categoryCount = await prisma.category.count();
    console.log(`📊 [getAllCategories] Category count from database: ${categoryCount}`);

    categories = await prisma.category.findMany({});
    console.log(`✅ [getAllCategories] Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log("📋 [getAllCategories] Categories:", categories.map(c => ({ id: c.id, name: c.name })));
    }
    
    // Retourner le tableau de catégories directement
    return response.json(categories);

  } catch (e) {
    console.error("❌ [getAllCategories] Error:", e);
    console.error("❌ [getAllCategories] Error details:", {
      name: e.name,
      message: e.message,
      code: e.code,
      stack: e.stack,
    });
    
    // Retourner une erreur 500 avec les détails
    return response.status(500).json({
      error: "Database connection error",
      message: e.message,
      code: e.code,
    });
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
