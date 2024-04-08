import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { User } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { name, password } = req.body as User;

    try {
      // Find the user in your database
      const user = await prisma.user.findFirst({ where: { name } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify the password hash
      const isPasswordValid = await bcrypt.compare(
        password || '',
        user.password || '',
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY || '',
        {
          expiresIn: '1h',
        },
      );

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
