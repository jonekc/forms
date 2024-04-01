import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import prisma from '../../lib/prisma';

const checkAuth = async (req: NextApiRequest) => {
  let check = { isAuthorized: true, isAdmin: false };

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    check = { isAuthorized: false, isAdmin: false };
  } else {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
      ) as JwtPayload;
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
      }
    } catch (error) {
      check = { isAuthorized: false, isAdmin: false };
    }
  }
  return check;
};

export { checkAuth };
