import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, SettingsThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { PaymentMethodProvider } from "@/lib/payment-methods-context";
import { OrderProvider } from "@/lib/orders-context";
import { Toaster } from "@/components/ui/sonner";
import { FaviconProvider } from "@/components/providers/favicon-provider";
import { MetadataProvider } from "@/components/providers/metadata-provider";
import { ThemeSyncComponent } from "@/components/providers/theme-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdminKit Pro - Multi-Module Enterprise Dashboard",
  description: "A comprehensive admin dashboard for managing users, products, orders, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <SettingsProvider>
              <ThemeSyncComponent />
              <FaviconProvider />
              <MetadataProvider />
              <CartProvider>
                <WishlistProvider>
                  <PaymentMethodProvider>
                    <OrderProvider>
                      {children}
                      <Toaster />
                    </OrderProvider>
                  </PaymentMethodProvider>
                </WishlistProvider>
              </CartProvider>
            </SettingsProvider>
          </AuthProvider>
        </SettingsThemeProvider>
      </body>
    </html>
  );
}
