import prisma from 'lib/prisma';

const getUsername = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user?.name;
};

export { getUsername };
