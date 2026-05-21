import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Protein Shake",
        category: ProductCategory.PROTEIN,
        priceCents: 899,
        description: "Vanilla whey protein shake",
        inventoryCount: 25,
      },
      {
        name: "Celsius",
        category: ProductCategory.DRINKS,
        priceCents: 349,
        inventoryCount: 40,
      },
      {
        name: "BodyArmor",
        category: ProductCategory.DRINKS,
        priceCents: 299,
        inventoryCount: 30,
      },
      {
        name: "Turkey Wrap",
        category: ProductCategory.GRAB_AND_GO,
        priceCents: 899,
        inventoryCount: 12,
      },
      {
        name: "Chicken Bowl",
        category: ProductCategory.HOT_FOOD,
        priceCents: 1299,
        isHotFood: true,
        isSelfServeEnabled: false,
        inventoryCount: 10,
      },
      {
        name: "Protein Bar",
        category: ProductCategory.SNACKS,
        priceCents: 399,
        inventoryCount: 50,
      },
    ],
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });