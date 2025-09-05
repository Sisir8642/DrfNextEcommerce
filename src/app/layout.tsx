import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Admin Login',
  description: 'Admin login for e-commerce frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <CartProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
          </CartProvider>
          <Toaster richColors />
      </body>
    </html>
  );
}
