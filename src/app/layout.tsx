'use client';
import './globals.css';
import { fonts } from './fonts';
import { Providers } from './providers';
import { ModalProvider } from './context/modalContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={fonts.rubik.variable}>
        <Providers>
          <ModalProvider>{children}</ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
