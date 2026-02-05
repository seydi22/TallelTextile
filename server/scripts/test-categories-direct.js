const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testCategories() {
  console.log("\n🔍 Testing Categories Directly...\n");
  
  try {
    // Test 1: Count categories
    console.log("1️⃣ Counting categories...");
    const count = await prisma.category.count();
    console.log(`   Total categories: ${count}\n`);

    // Test 2: Find all categories
    console.log("2️⃣ Finding all categories...");
    const allCategories = await prisma.category.findMany({});
    console.log(`   Found ${allCategories.length} categories:`);
    allCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ID: ${cat.id}, Name: "${cat.name}"`);
    });
    console.log("");

    // Test 3: Count query (MongoDB doesn't support $queryRaw with SQL)
    console.log("3️⃣ Count query...");
    const countResult = await prisma.category.count();
    console.log(`   Count result: ${countResult}\n`);

    // Test 4: Create a test category
    console.log("4️⃣ Creating a test category...");
    const testCategoryName = `test-${Date.now()}`;
    try {
      const created = await prisma.category.create({
        data: { name: testCategoryName }
      });
      console.log(`   ✅ Created: ID: ${created.id}, Name: "${created.name}"\n`);

      // Test 5: Verify it exists
      console.log("5️⃣ Verifying test category exists...");
      const found = await prisma.category.findUnique({
        where: { id: created.id }
      });
      console.log(`   ${found ? '✅' : '❌'} Category ${found ? 'exists' : 'not found'}\n`);

      // Test 6: Delete test category
      console.log("6️⃣ Cleaning up test category...");
      await prisma.category.delete({
        where: { id: created.id }
      });
      console.log("   ✅ Test category deleted\n");

    } catch (createError) {
      console.error("   ❌ Error creating test category:", createError.message);
      if (createError.code === 'P2002') {
        console.log("   ⚠️  Category already exists (unique constraint)");
      }
    }

    // Test 7: List all categories again
    console.log("7️⃣ Final category list...");
    const finalCategories = await prisma.category.findMany({});
    console.log(`   Total: ${finalCategories.length} categories\n`);

  } catch (error) {
    console.error("❌ Error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
  } finally {
    await prisma.$disconnect();
    console.log("✅ Disconnected from database\n");
  }
}

testCategories();
