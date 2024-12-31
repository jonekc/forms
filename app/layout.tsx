import { Metadata } from 'next';
import Header from '../components/Header';
import './globals.css';
import { AuthProvider } from '../providers/AuthProvider';
import { ToastProvider } from '../providers/ToastProvider';

export const metadata: Metadata = {
  title: 'Blog application',
  description:
    'Application for displaying posts with images. The data is saved in a database. Users can see post details, comment and admin can manage posts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link
          rel="apple-touch-icon"
          href="/apple-icon.png"
          type="image/png"
          sizes="180x180"
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="m-auto max-w-6xl px-5 pb-5 w-full">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
