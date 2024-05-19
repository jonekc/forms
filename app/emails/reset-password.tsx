import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

type ResetPasswordProps = { username: string; link: string };

const ResetPassword = ({ username, link }: ResetPasswordProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: { colors: { primary: '#4400f6' } },
        },
        plugins: [require('daisyui')],
      }}
    >
      <Html>
        <Head />

        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            {/* <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/vercel-logo.png`}
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section> */}
            <Text className="text-black text-[14px] leading-[24px]">
              Hi <strong>{username}</strong>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Someone recently requested a password reset for your Forms
              account. If this was you, you can set a new password here:
            </Text>
            <Section className="text-center my-5">
              <Button
                className="bg-primary rounded-lg text-white text-sm px-3 py-2"
                href={link}
              >
                Set new password
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{' '}
              <strong className="text-black">{username}</strong>. If you were
              not expecting this invitation, you can ignore this email. If you
              are concerned about your account's safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default ResetPassword;
