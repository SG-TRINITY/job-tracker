import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chowder — Job Tracker',
  description: 'Track your job applications',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="stardew" data-mode="light" data-density="regular">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=VT323&family=Pixelify+Sans:wght@400;500;600;700&family=Jersey+15&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
