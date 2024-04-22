import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';

const POST = async (req: Request) => {
  const body = await req.json();
  const { name, password } = body as User;

  try {
    // Find the user in your database
    const user = await prisma.user.findFirst({ where: { name } });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Verify the password hash
    const isPasswordValid = await bcrypt.compare(
      password || '',
      user.password || '',
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY || '',
      {
        expiresIn: '1h',
      },
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};

export { POST };
