const prisma = require("../utills/db");

async function getSingleProductImages(request, response) {
  try {
    const { id } = request.params;
    
    // Validation: vérifier que l'ID est fourni et valide
    if (!id || id === 'undefined' || id === 'null') {
      console.error("❌ Invalid product ID provided:", id);
      return response.status(400).json({ 
        error: "Product ID is required",
        details: "A valid product ID must be provided"
      });
    }

    // Vérifier que l'ID est un ObjectID valide (24 caractères hexadécimaux)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error("❌ Invalid ObjectID format:", id);
      return response.status(400).json({ 
        error: "Invalid product ID format",
        details: "Product ID must be a valid MongoDB ObjectID (24 hex characters)"
      });
    }

    const images = await prisma.image.findMany({
      where: { productID: id },
    });
    
    // Retourner un tableau vide si aucune image n'est trouvée (pas une erreur)
    return response.json(images || []);
  } catch (error) {
    console.error("❌ Error fetching product images:", error);
    return response.status(500).json({ 
      error: "Error fetching product images",
      details: error.message 
    });
  }
}

const MAX_EXTRA_IMAGES_PER_PRODUCT = 4; // 1 main + 4 = 5 photos max par produit

async function createImage(request, response) {
  try {
    const { productID, image } = request.body;
    if (!productID || !image) {
      return response.status(400).json({
        error: "productID and image are required",
      });
    }
    const count = await prisma.image.count({
      where: { productID: String(productID) },
    });
    if (count >= MAX_EXTRA_IMAGES_PER_PRODUCT) {
      return response.status(400).json({
        error: "Maximum number of images reached",
        details: `Un produit peut avoir au maximum ${MAX_EXTRA_IMAGES_PER_PRODUCT} images supplémentaires (5 photos au total avec l'image principale).`,
      });
    }
    const created = await prisma.image.create({
      data: {
        productID: String(productID),
        image: String(image),
      },
    });
    return response.status(201).json(created);
  } catch (error) {
    console.error("Error creating image:", error);
    return response.status(500).json({ error: "Error creating image" });
  }
}

async function updateImage(request, response) {
  try {
    const { id } = request.params; // Getting product id from params
    const { productID, image } = request.body;

    // Checking whether photo exists for the given product id
    const existingImage = await prisma.image.findFirst({
      where: {
        productID: id, // Finding photo with a product id
      },
    });

    // if photo doesn't exist, return coresponding status code
    if (!existingImage) {
      return response
        .status(404)
        .json({ error: "Image not found for the provided productID" });
    }

    // Updating photo using coresponding imageID
    const updatedImage = await prisma.image.update({
      where: {
        imageID: existingImage.imageID, // Using imageID of the found existing image
      },
      data: {
        productID: productID,
        image: image,
      },
    });

    return response.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return response.status(500).json({ error: "Error updating image" });
  }
}

async function deleteImage(request, response) {
  try {
    const { id } = request.params;
    await prisma.image.deleteMany({
      where: {
        productID: String(id),
      },
    });
    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}

async function deleteOneImage(request, response) {
  try {
    const { imageId } = request.params;
    if (!imageId) {
      return response.status(400).json({ error: "Image ID is required" });
    }
    await prisma.image.delete({
      where: { imageID: imageId },
    });
    return response.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return response.status(404).json({ error: "Image not found" });
    }
    console.error("Error deleting image:", error);
    return response.status(500).json({ error: "Error deleting image" });
  }
}

module.exports = {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
  deleteOneImage,
};
