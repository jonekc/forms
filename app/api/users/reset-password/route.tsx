import prisma from 'lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import ResetPassword from 'app/emails/reset-password';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { headers } from 'next/headers';

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
      let resetToken = crypto.randomBytes(32).toString('hex');
      let resetPassword = await bcrypt.hash(resetToken, 10);

      const resetPasswordExpiresAt = new Date();
      resetPasswordExpiresAt.setHours(resetPasswordExpiresAt.getHours() + 1);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPassword,
          resetPasswordExpiresAt,
        },
      });

      const searchParams = new URLSearchParams({
        email: user.email,
        token: resetToken,
      });
      const headersList = headers();
      const origin = headersList.get('origin') || '';
      const emailService = new Resend(process.env.RESEND_API_KEY);
      await emailService.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Password reset in the Forms app',
        react: (
          <ResetPassword
            username={user.name || ''}
            link={`${origin}/set-password?${searchParams.toString()}`}
          />
        ),
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
