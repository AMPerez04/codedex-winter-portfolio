import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Austin Perez - Creative Developer | Web & Mobile Solutions for Startups",
  description: "Austin Perez's portfolio site. Hire Austin Perez - an experienced creative developer specializing in web and mobile solutions for startups. Let's bring your vision to life with innovative technology!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Austin Perez - Creative Developer | Web & Mobile Solutions for Startups</title>
        <meta name="description" content="Hire Austin Perez - an experienced creative developer specializing in web and mobile solutions for startups. Let's bring your vision to life with innovative technology!" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Austin Perez, freelance developer, web developer, app developer, hire Austin Perez" />
        <meta name="author" content="Austin Perez" />
        <meta property="og:title" content="Hire Austin Perez | Freelance Web and App Developer" />
        <meta property="og:description" content="Hire Austin Perez, a versatile freelance developer specializing in web and app development. Proven expertise in crafting impactful digital solutions." />
        <meta property="og:url" content="https://austinperez.xyz/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hire Austin Perez | Freelance Web and App Developer" />
        <meta name="twitter:description" content="Hire Austin Perez, a versatile freelance developer specializing in web and app development. Proven expertise in crafting impactful digital solutions." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Austin Perez",
            "jobTitle": "Freelance Web and App Developer",
            "url": "https://austinperez.xyz/",
            "email": "mailto:austinp0502@gmail.com",
            "sameAs": [
              "https://github.com/AMPerez04",
              "https://www.linkedin.com/in/austin-m-perez/"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "Austin Perez"
            }
          }
        `}
        </script>
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Austin Perez Developer",
            "url": "https://austinperez.xyz/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://austinperez.xyz/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>



    </html>
  );
}
