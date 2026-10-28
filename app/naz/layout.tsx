import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naz",
  description: null,
  keywords: null,
  authors: null,
  creator: null,
  alternates: null, // ana sayfaya canonical vermesin
  openGraph: null,
  twitter: null,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function NazLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}