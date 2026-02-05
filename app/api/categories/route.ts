import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    console.log("🔍 [API /api/categories] Fetching categories...");
    
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`✅ [API /api/categories] Found ${categories.length} categories`);

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      title: category.name,
      // Assuming a simple slug generation for the href
      href: `/shop/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
      // Use category image if available, otherwise placeholder
      bgImage: category.image ? `/${category.image}` : "/product_placeholder.jpg", 
    }));

    // Always return an array, even if empty
    return NextResponse.json(formattedCategories, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error("❌ [API /api/categories] Error fetching categories:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    });
    
    // Return empty array instead of error to prevent UI flash
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  }
}
