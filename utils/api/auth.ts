import { NextApiRequest } from 'next';
import prisma from '../../lib/prisma';
import { getDecodedToken } from './common';

const checkAuth = async (req: NextApiRequest) => {
  const decodedToken = getDecodedToken(req);
  let check = { isAuthorized: true, isAdmin: false };

  if (!decodedToken || typeof decodedToken === 'string') {
    check = { isAuthorized: false, isAdmin: false };
  } else {
    try {
      const userId = decodedToken.userId;

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
      if (!user) {
        check = { isAuthorized: false, isAdmin: false };
      }
      if (user?.roles.some((role) => role.role.name === 'admin')) {
        check = { isAuthorized: true, isAdmin: true };
      } else {
        check = { isAuthorized: true, isAdmin: false };
      }
    } catch (error) {
      check = { isAuthorized: false, isAdmin: false };
    }
  }
  return { ...check, decodedToken };
};

export { checkAuth };
