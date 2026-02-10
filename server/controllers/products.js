const prisma = require("../utills/db"); // ✅ Use shared connection with SSL
const { asyncHandler, handleServerError, AppError } = require("../utills/errorHandler");

// Security: Define whitelists for allowed filter types and operators
const ALLOWED_FILTER_TYPES = ['price', 'rating', 'category', 'inStock', 'outOfStock'];
const ALLOWED_OPERATORS = ['gte', 'lte', 'gt', 'lt', 'equals', 'contains'];
const ALLOWED_SORT_VALUES = ['defaultSort', 'titleAsc', 'titleDesc', 'lowPrice', 'highPrice'];

// Security: Input validation functions
function validateFilterType(filterType) {
  return ALLOWED_FILTER_TYPES.includes(filterType);
}

function validateOperator(operator) {
  return ALLOWED_OPERATORS.includes(operator);
}

function validateSortValue(sortValue) {
  return ALLOWED_SORT_VALUES.includes(sortValue);
}

function validateAndSanitizeFilterValue(filterType, filterValue) {
  switch (filterType) {
    case 'price':
    case 'rating':
    case 'inStock':
    case 'outOfStock':
      const numValue = parseInt(filterValue);
      return isNaN(numValue) ? null : numValue;
    case 'category':
      return typeof filterValue === 'string' && filterValue.trim().length > 0 
        ? filterValue.trim() 
        : null;
    default:
      return null;
  }
}

// Security: Safe filter object builder
function buildSafeFilterObject(filterArray) {
  const filterObj = {};
  
  for (const item of filterArray) {
    // Validate filter type
    if (!validateFilterType(item.filterType)) {
      console.warn(`Invalid filter type: ${item.filterType}`);
      continue;
    }
    
    // Validate operator
    if (!validateOperator(item.filterOperator)) {
      console.warn(`Invalid operator: ${item.filterOperator}`);
      continue;
    }
    
    // Validate and sanitize filter value
    const sanitizedValue = validateAndSanitizeFilterValue(item.filterType, item.filterValue);
    if (sanitizedValue === null) {
      console.warn(`Invalid filter value for ${item.filterType}: ${item.filterValue}`);
      continue;
    }
    
    // Build safe filter object
    filterObj[item.filterType] = {
      [item.filterOperator]: sanitizedValue,
    };
  }
  
  return filterObj;
}

const getAllProducts = asyncHandler(async (request, response) => {
  try {
    const mode = request.query.mode || "";
    
    // checking if we are on the admin products page because we don't want to have filtering, sorting and pagination there
    if(mode === "admin"){
      const adminProducts = await prisma.product.findMany({});
      return response.json(adminProducts);
    } else {
    const dividerLocation = request.url.indexOf("?");
    let filterObj = {};
    let sortObj = {};
    let sortByValue = "defaultSort";

    // getting current page with validation
    const page = Number(request.query.page);
    const validatedPage = (page && page > 0) ? page : 1;

    if (dividerLocation !== -1) {
      const queryArray = request.url
        .substring(dividerLocation + 1, request.url.length)
        .split("&");

      let filterType;
      let filterArray = [];

      for (let i = 0; i < queryArray.length; i++) {
        // Security: Use more robust parsing with validation
        const queryParam = queryArray[i];
        
        // Extract filter type safely
        if (queryParam.includes("filters")) {
          if (queryParam.includes("price")) {
            filterType = "price";
          } else if (queryParam.includes("rating")) {
            filterType = "rating";
          } else if (queryParam.includes("category")) {
            filterType = "category";
          } else if (queryParam.includes("inStock")) {
            filterType = "inStock";
          } else if (queryParam.includes("outOfStock")) {
            filterType = "outOfStock";
          } else {
            // Skip unknown filter types
            continue;
          }
        }

        if (queryParam.includes("sort")) {
          // Security: Validate sort value
          const extractedSortValue = queryParam.substring(queryParam.indexOf("=") + 1);
          if (validateSortValue(extractedSortValue)) {
            sortByValue = extractedSortValue;
          }
        }

        // Security: Extract filter parameters safely
        if (queryParam.includes("filters") && filterType) {
          let filterValue;
          
          // Extract filter value based on type
          if (filterType === "category") {
            filterValue = queryParam.substring(queryParam.indexOf("=") + 1);
          } else {
            const numValue = parseInt(queryParam.substring(queryParam.indexOf("=") + 1));
            filterValue = isNaN(numValue) ? null : numValue;
          }

          // Extract operator safely
          const operatorStart = queryParam.indexOf("$") + 1;
          const operatorEnd = queryParam.indexOf("=") - 1;
          
          if (operatorStart > 0 && operatorEnd > operatorStart) {
            const filterOperator = queryParam.substring(operatorStart, operatorEnd);
            
            // Only add to filter array if all values are valid
            if (filterValue !== null && filterOperator) {
              filterArray.push({ 
                filterType, 
                filterOperator, 
                filterValue 
              });
            }
          }
        }
      }
      
      // Security: Build filter object using safe function
      filterObj = buildSafeFilterObject(filterArray);
    }

    // Build whereClause for Prisma, handling each filter type correctly
    let whereClause = {};
    
    // Handle price filter - ensure it's a valid Prisma filter object
    if (filterObj.price && typeof filterObj.price === 'object') {
      whereClause.price = filterObj.price;
    }
    
    // Handle rating filter - ensure it's a valid Prisma filter object
    if (filterObj.rating && typeof filterObj.rating === 'object') {
      whereClause.rating = filterObj.rating;
    }
    
    // Handle inStock filter - ensure it's a valid Prisma filter object
    if (filterObj.inStock && typeof filterObj.inStock === 'object') {
      whereClause.inStock = filterObj.inStock;
    }
    
    // Note: category filter is handled separately below

    // Security: Build sort object safely
    switch (sortByValue) {
      case "defaultSort":
        sortObj = { id: "asc" }; // Use id as default sort instead of empty object
        break;
      case "titleAsc":
        sortObj = { title: "asc" };
        break;
      case "titleDesc":
        sortObj = { title: "desc" };
        break;
      case "lowPrice":
        sortObj = { price: "asc" };
        break;
      case "highPrice":
        sortObj = { price: "desc" };
        break;
      default:
        sortObj = { id: "asc" }; // Use id as default sort instead of empty object
    }

    // Log pour débogage
    console.log("🔍 [getAllProducts] Filter object:", JSON.stringify(filterObj, null, 2));
    console.log("🔍 [getAllProducts] Where clause:", JSON.stringify(whereClause, null, 2));
    console.log("🔍 [getAllProducts] Sort object:", JSON.stringify(sortObj, null, 2));
    console.log("🔍 [getAllProducts] Page:", validatedPage);

    let products;
    const baseQueryOptions = {
      skip: (validatedPage - 1) * 10,
      take: 12,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: sortObj,
    };

    try {
      // First, get all valid category IDs to filter out products with invalid categories
      const validCategoryIds = await prisma.category.findMany({
        select: { id: true },
      }).then(categories => categories.map(c => c.id));
      
      console.log(`🔍 [getAllProducts] Found ${validCategoryIds.length} valid categories`);

      // Build base where clause that ensures categoryId exists in valid categories
      const baseWhere = {
        categoryId: {
          in: validCategoryIds.length > 0 ? validCategoryIds : [], // Only include products with valid category IDs
        },
      };

      if (Object.keys(filterObj).length === 0) {
        // No filters, get all products with valid categories
        console.log("🔍 [getAllProducts] Fetching all products without filters (with valid categories)");
        products = await prisma.product.findMany({
          ...baseQueryOptions,
          where: baseWhere,
        });
      } else {
        // Security: Handle category filter with proper validation
        if (filterObj.category && filterObj.category.equals) {
          console.log("🔍 [getAllProducts] Fetching products with category filter:", filterObj.category.equals);
          // Find the category ID by name (case-insensitive search)
          // Normalize the search term: lowercase and trim
          const normalizedCategoryName = filterObj.category.equals.toLowerCase().trim();
          
          // Get all categories and find the one that matches (case-insensitive)
          const allCategories = await prisma.category.findMany({
            select: { id: true, name: true },
          });
          
          const category = allCategories.find(
            cat => cat.name.toLowerCase().trim() === normalizedCategoryName
          );
          
          if (category) {
            console.log(`✅ [getAllProducts] Found category: ${category.name} (ID: ${category.id})`);
            products = await prisma.product.findMany({
              ...baseQueryOptions,
              where: {
                ...whereClause,
                categoryId: category.id, // Filter by category ID
              },
            });
          } else {
            // Category not found, return empty array
            console.warn(`⚠️ [getAllProducts] Category not found: "${filterObj.category.equals}"`);
            console.warn(`⚠️ [getAllProducts] Available categories:`, allCategories.map(c => c.name));
            products = [];
          }
        } else {
          console.log("🔍 [getAllProducts] Fetching products with filters (no category)");
          // Only use whereClause if it has valid filters
          if (Object.keys(whereClause).length > 0) {
            products = await prisma.product.findMany({
              ...baseQueryOptions,
              where: {
                ...whereClause,
                ...baseWhere, // Ensure category exists
              },
            });
          } else {
            // If whereClause is empty but filterObj has other filters, get all products with valid categories
            products = await prisma.product.findMany({
              ...baseQueryOptions,
              where: baseWhere,
            });
          }
        }
      }

      console.log(`✅ [getAllProducts] Found ${products.length} products`);
      return response.json(products);
    } catch (error) {
      console.error("❌ [getAllProducts] Prisma error:", error);
      console.error("❌ [getAllProducts] Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      // Re-throw to let asyncHandler handle it
      throw error;
    }
    }
  } catch (error) {
    // Catch any errors that occur outside the inner try/catch
    console.error("❌ [getAllProducts] Outer catch - Unexpected error:", error);
    console.error("❌ [getAllProducts] Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    // Re-throw to let asyncHandler handle it
    throw error;
  }
});

const getAllProductsOld = asyncHandler(async (request, response) => {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
  response.status(200).json(products);
});

const createProduct = asyncHandler(async (request, response) => {
  const {
    merchantId,
    slug,
    title,
    mainImage,
    price,
    description,
    manufacturer,
    categoryId,
    inStock,
  } = request.body;

  if (!title) {
    throw new AppError("Missing required field: title", 400);
  }
  
  // Basic validation
  if (!merchantId) {
    throw new AppError("Missing required field: merchantId", 400);
  }
  
  if (!slug) {
    throw new AppError("Missing required field: slug", 400);
  }

  if (!price) {
    throw new AppError("Missing required field: price", 400);
  }

  if (!categoryId) {
    throw new AppError("Missing required field: categoryId", 400);
  }

  const product = await prisma.product.create({
    data: {
      merchantId,
      slug,
      title,
      mainImage,
      price,
      rating: 5,
      description,
      manufacturer,
      categoryId,
      inStock,
    },
  });
  return response.status(201).json(product);
});

// Method for updating existing product
const updateProduct = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const {
    merchantId,
    slug,
    title,
    mainImage,
    price,
    rating,
    description,
    manufacturer,
    categoryId,
    inStock,
  } = request.body;

  // Basic validation
  if (!id) {
    throw new AppError("Product ID is required", 400);
  }

  // Finding a product by id
  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  // Updating found product
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      merchantId: merchantId,
      title: title,
      mainImage: mainImage,
      slug: slug,
      price: price,
      rating: rating,
      description: description,
      manufacturer: manufacturer,
      categoryId: categoryId,
      inStock: inStock,
    },
  });

  return response.status(200).json(updatedProduct);
});

// Method for deleting a product
const deleteProduct = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Product ID is required", 400);
  }

  // Check for related records in order_product table
  const relatedOrderProductItems = await prisma.customer_order_product.findMany({
    where: {
      productId: id,
    },
  });
  
  if(relatedOrderProductItems.length > 0){
    throw new AppError("Cannot delete product because of foreign key constraint", 400);
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });
  return response.status(204).send();
});

const searchProducts = asyncHandler(async (request, response) => {
  const { query } = request.query;
  
  if (!query) {
    throw new AppError("Query parameter is required", 400);
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
    },
  });

  return response.json(products);
});

const getProductById = asyncHandler(async (request, response) => {
  const { id } = request.params;
  
  if (!id) {
    throw new AppError("Product ID is required", 400);
  }

  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
    },
  });
  
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  
  return response.status(200).json(product);
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductById,
};
