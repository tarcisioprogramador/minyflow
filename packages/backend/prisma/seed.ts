import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@minyflow.com';
  const password = 'admin123';

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin',
      password: hashed,
      plan: 'PREMIUM',
      messageLimit: 100000,
    },
  });

  console.log('Admin user created/updated:');
  console.log(`  Email: ${email}`);
  console.log(`  Senha: ${password}`);
  console.log(`  ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
