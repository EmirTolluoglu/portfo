import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Emir Tolluoğlu | Full Stack Developer",
  description:
    "Portfolio of Emir Tolluoğlu. Full Stack Developer specialized in Next.js, React, TypeScript, Tailwind CSS, Robotics and AI projects.",

  keywords: [
    "Emir Tolluoğlu",
    "Full Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Portfolio",
    "Frontend",
    "Backend",
    "Web Developer",
    "Software Engineer"
  ],
  authors: [{ name: "Emir Tolluoğlu" }],
  creator: "Emir Tolluoğlu",
  robots: {
    index: true,
    follow: true
  },

  alternates: {
    canonical: "https://emirtolluoglu.com"
  },

  openGraph: {
  title: "Emir Tolluoğlu | Full Stack Developer",
  description:
    "Portfolio of Emir Tolluoğlu. Next.js, React, TypeScript and Robotics.",
  url: "https://emirtolluoglu.com",
  siteName: "Emir Tolluoğlu",

  images: [
    {
      url: "/grupcaemir.png",
      width: 1200,
      height: 630,
      alt: "Emir Tolluoğlu Portfolio"
    }
  ],
  locale: "en_US",
  type: "website"
},

twitter: {
  card: "summary_large_image",
  title: "Emir Tolluoğlu | Full Stack Developer",
  description:
    "Portfolio of Emir Tolluoğlu",
  images: ["/grupcaemir.png"]
},

icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
},
manifest: "/site.webmanifest",
themeColor: "#050505",

};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>

      
    </html>
  );
}
