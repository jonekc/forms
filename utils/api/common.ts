import jwt, { JwtPayload } from 'jsonwebtoken';
import { headers } from 'next/headers';

const getDecodedToken = () => {
  const headersList = headers();
  const token = headersList.get('authorization')?.replace('Bearer ', '');
  let decodedToken: JwtPayload | string = '';
  if (token) {
    try {
      decodedToken = jwt.verify(token || '', process.env.JWT_SECRET_KEY || '');
    } catch (e) {}
  }
  return decodedToken;
};

export { getDecodedToken };
