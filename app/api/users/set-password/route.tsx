import prisma from 'lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const PATCH = async (req: NextRequest) => {
  const body = await req.json();
  const { email, token, password } = body as {
    email?: string;
    token?: string;
    password?: string;
  };

  if (email && password && token) {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        resetPassword: true,
        resetPasswordExpiresAt: true,
      },
      where: { email },
    });
    if (user?.resetPasswordExpiresAt && user?.resetPassword) {
      const isResetPasswordValid =
        (await bcrypt.compare(token || '', user.resetPassword || '')) &&
        user.resetPasswordExpiresAt > new Date();

      if (isResetPasswordValid) {
        const newPassword = await bcrypt.hash(password || '', 10);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: newPassword,
            resetPassword: null,
            resetPasswordExpiresAt: null,
          },
        });
        return new Response(undefined, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid email' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Empty fields' }, { status: 400 });
  }
};

export { PATCH };
