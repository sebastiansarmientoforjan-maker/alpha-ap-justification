import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
