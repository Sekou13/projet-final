const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Créer l'admin
    await prisma.user.create({
      data: {
        firstName: "Sekou",
        lastName: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin créé avec succès !");
  } else {
    console.log("L'admin existe déjà.");
  }
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });