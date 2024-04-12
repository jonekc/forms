import { Metadata } from 'next';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Forms application',
  description:
    'Send forms with images and the data will be saved in a database',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="layout">{children}</main>
      </body>
    </html>
  );
}
