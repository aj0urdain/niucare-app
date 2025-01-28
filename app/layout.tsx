import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/atoms/theme-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s › Niucare",
    default: "Niucare",
  },
  description: "Niucare internal platform for healthcare operations.",
  keywords: ["Niucare", "healthcare", "internal platform"],
  authors: [{ name: "Aaron J. Girton" }],
  creator: "Aaron J. Girton",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
