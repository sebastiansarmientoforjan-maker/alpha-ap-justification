import type { Metadata } from "next";
import "./globals.css";
import { RoleSwitcher } from "@/components/ui/role-switcher";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export const metadata: Metadata = {
  title: "AP Math Justification Training",
  description: "4-week justification training course for Alpha High School AP Math students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ScrollToTop />
        {children}
        <RoleSwitcher />
      </body>
    </html>
  );
}
