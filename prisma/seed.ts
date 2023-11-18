import { PrismaClient, Prisma, UserType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { addMonths } from "date-fns";
import { OfferType } from "@prisma/client";

const prisma = new PrismaClient();

function createNewUser(
  type: UserType,
  tags?: string[]
): Prisma.UserCreateInput {
  const offerTypes: OfferType[] = ["stage", "cdi", "cdd"];
  const randomTag = tags ? tags[Math.floor(Math.random() * tags.length)] : null;

  return {
    type: type,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    birthday: faker.date.birthdate(),
    displayName: faker.internet.userName(),
    password: faker.internet.password({ length: 6, memorable: true }),
    profilePictureUrl: faker.image.urlLoremFlickr({ category: "business" }),
    bio: faker.person.bio(),
    tags: randomTag
      ? {
          connectOrCreate: [
            {
              where: { name: randomTag },
              create: {
                name: randomTag,
              },
            },
          ],
        }
      : undefined,
    myOffers: {
      create: [
        {
          title: faker.person.jobTitle(),
          description: faker.person.jobDescriptor(),
          pictureUrl: faker.image.urlLoremFlickr({ category: "technics" }),
          type: offerTypes[Math.floor(Math.random() * offerTypes.length)],
          endsAt: addMonths(new Date(), 2),
          isOffering: type === "company",
          salary: faker.number.int({ min: 1000, max: 5000 }),
          tags: randomTag
            ? {
                connectOrCreate: [
                  {
                    where: { name: randomTag },
                    create: {
                      name: randomTag,
                    },
                  },
                ],
              }
            : undefined,
        },
        {
          title: faker.person.jobTitle(),
          description: faker.person.jobDescriptor(),
          pictureUrl: faker.image.urlLoremFlickr({ category: "technics" }),
          type: offerTypes[Math.floor(Math.random() * offerTypes.length)],
          endsAt: addMonths(new Date(), 2),
          isOffering: type === "company",
          salary: faker.number.int({ min: 1000, max: 5000 }),
          tags: randomTag
            ? {
                connectOrCreate: [
                  {
                    where: { name: randomTag },
                    create: {
                      name: randomTag,
                    },
                  },
                ],
              }
            : undefined,
        },
      ],
    },
  };
}

async function seed() {
  console.log("Started seeding...");
  const adminUser = await prisma.user.create({
    data: {
      type: "admin",
      firstName: "Casimir",
      lastName: "Colas",
      displayName: "Casimir Colas | Admin",
      email: "admin@internatic.com",
      birthday: new Date(2001, 5, 15),
      password: "awsomeAdmin",
    },
  });
  console.log("Created admin");
  for await (const i of Array.from(Array(10).keys())) {
    const newUser = await createNewUser("user", ["front", "back", "fullstack"]);
    const createdUser = await prisma.user.create({ data: newUser });
    console.log(
      `Created user ${createdUser.displayName} with id: ${createdUser.id}`
    );
  }
  for await (const i of Array.from(Array(3).keys())) {
    const newUser = await createNewUser("company", [
      "front",
      "back",
      "fullstack",
    ]);
    const createdUser = await prisma.user.create({ data: newUser });
    console.log(
      `Created company ${createdUser.displayName} with id: ${createdUser.id}`
    );
  }
  console.log("Finished seeding!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
