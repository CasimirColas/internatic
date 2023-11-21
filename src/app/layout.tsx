import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/auth/Provider";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import Navbar from "@/components/pages/ui/Navbar";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "Internatic | %s", default: "Internatic" },
  description: "The new way to find an developer jobs",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="en">
      <body
        className={twMerge(inter.className, "h-screen w-screen flex flex-col")}
      >
        <Provider session={session}>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
