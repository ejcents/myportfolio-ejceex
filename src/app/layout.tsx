import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EJCEEX - Creative Design Portfolio",
  description: "Passionate full stack developer creating beautiful and functional web applications. Specializing in React, Node.js, and modern web technologies.",
  keywords: ["Full Stack Developer", "Web Developer", "React", "Node.js", "TypeScript", "Portfolio"],
  authors: [{ name: "John Doe" }],
  openGraph: {
    title: "John Doe - Full Stack Developer Portfolio",
    description: "Passionate full stack developer creating beautiful and functional web applications.",
    type: "website",
    url: "https://johndoe.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserAuthProvider>
          <PortfolioProvider>
            <AdminAuthProvider>
              {children}
            </AdminAuthProvider>
          </PortfolioProvider>
        </UserAuthProvider>
      </body>
    </html>
  );
}
