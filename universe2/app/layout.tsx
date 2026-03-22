import './globals.css';
import { ReactNode } from 'react';
import { Russo_One } from 'next/font/google';

const russoOne = Russo_One({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: "Universe Simulation",
  description: "Made with Next.js and Three.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body
        className={`${russoOne.className} bg-black bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
};
