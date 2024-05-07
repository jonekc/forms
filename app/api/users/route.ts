import prisma from 'lib/prisma';
import { checkAuth } from 'utils/api/auth';
import { NextResponse } from 'next/server';

const GET = async () => {
  const { isAuthorized, isAdmin } = await checkAuth();

  if (isAuthorized && isAdmin) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(users, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};

export { GET };
