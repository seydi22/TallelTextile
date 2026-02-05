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
  const debug_info = {};

  debug_info.database_url_is_set = !!process.env.DATABASE_URL;
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      debug_info.database_host = url.hostname;
      debug_info.database_port = url.port;
      debug_info.database_user = url.username;
      debug_info.database_name = url.pathname.substring(1);
    } catch (e) {
      debug_info.database_url_parsing_error = e.message;
    }
  }

  let categories = [];
  try {
    console.log("🔍 [getAllCategories] Starting category fetch...");
    
    // MongoDB doesn't support $queryRaw with SQL syntax
    // Use count() instead for MongoDB
    const categoryCount = await prisma.category.count();
    debug_info.category_count = categoryCount;
    console.log(`📊 [getAllCategories] Category count from database: ${categoryCount}`);

    categories = await prisma.category.findMany({});
    debug_info.prisma_findMany_count = categories.length;
    debug_info.connection_status = "OK";
    
    console.log(`✅ [getAllCategories] Found ${categories.length} categories`);
    if (categories.length > 0) {
      console.log("📋 [getAllCategories] Categories:", categories.map(c => ({ id: c.id, name: c.name })));
    } else if (categoryCount > 0) {
      console.warn("⚠️ [getAllCategories] Count says there are categories but findMany returned empty!");
    }

  } catch (e) {
    console.error("❌ [getAllCategories] Error:", e);
    debug_info.connection_error = {
      name: e.name,
      message: e.message,
      code: e.code,
      clientVersion: e.clientVersion,
    };
  }

  // The frontend expects an array, but for debugging, we are temporarily
  // changing the response. The user will see this in the browser's network tab.
  return response.json({
    categories: categories,
    _debug: debug_info,
  });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
