const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Define an async function called main to send queries to the database.
// You will write all your queries inside this function
async function main() {
  await prisma.link.create({
    data: {
      description: "Fullstack tutorial for GraphQL",
      url: "www.howtographql.com",
    },
  });

  const allLinks = await prisma.link.findMany();

  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  // Close the database connections when the script terminates.
  .finally(async () => {
    await prisma.disconnect;
  });
