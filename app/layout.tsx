import { Metadata } from 'next';
import Header from '../components/Header';
import './globals.css';
import { AuthProvider } from '../providers/AuthProvider';
import { ToastProvider } from '../providers/ToastProvider';

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
