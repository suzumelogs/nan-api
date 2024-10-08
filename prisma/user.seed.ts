import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    name: 'User',
    email: 'user@gmail.com',
    password: 'user@123',
    role: Role.user,
    emailVerified: new Date(),
  },
  {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'admin@123',
    role: Role.admin,
    emailVerified: new Date(),
  },
];

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const seedUser = async (user: (typeof users)[number]) => {
  const hashedPassword = await hashPassword(user.password);
  await prisma.user.upsert({
    where: { email: user.email },
    update: {},
    create: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });

  console.log(`User ${user.email} seeded successfully.`);
};

const userSeed = async () => {
  try {
    for (const user of users) {
      await seedUser(user);
    }
  } catch (error) {
    console.error('Error seeding users: ', error);
  } finally {
    await prisma.$disconnect();
  }
};

export default userSeed;
