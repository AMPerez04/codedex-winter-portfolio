import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const title = 'Austin Perez · Software Engineer';
const description =
  'Software engineer at Microsoft on Windows File Explorer and founding engineer of SPARC Sports, an AI mental performance platform. I build products from zero and ship them to real users.';

export const metadata = {
  metadataBase: new URL('https://austinperez.xyz'),
  title,
  description,
  authors: [{ name: 'Austin Perez', url: 'https://austinperez.xyz' }],
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: 'https://austinperez.xyz/',
    siteName: 'Austin Perez',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f6' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1110' },
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Austin Perez',
  jobTitle: 'Software Engineer',
  url: 'https://austinperez.xyz/',
  email: 'mailto:austinp0502@gmail.com',
  worksFor: { '@type': 'Organization', name: 'Microsoft' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Washington University in St. Louis',
  },
  sameAs: ['https://github.com/AMPerez04', 'https://www.linkedin.com/in/austin-m-perez/'],
};

// Applies a saved theme before first paint so the page never flashes.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
