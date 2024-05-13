import prisma from 'lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import ResetPassword from 'app/emails/reset-password';

const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { email } = body as User;

  if (email) {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { email },
      orderBy: { name: 'asc' },
    });
    if (user?.email) {
      const emailService = new Resend(process.env.RESEND_API_KEY);
      await emailService.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Password reset in the Forms app',
        react: <ResetPassword />,
      });
      return new Response(undefined, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid email' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: 'Empty email field' }, { status: 400 });
  }
};

export { POST };
