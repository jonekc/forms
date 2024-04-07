import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

const getDecodedToken = (req: NextApiRequest) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let decodedToken: JwtPayload | string = '';
  if (token) {
    decodedToken = jwt.verify(token || '', process.env.JWT_SECRET_KEY || '');
  }
  return decodedToken;
};

export { getDecodedToken };
