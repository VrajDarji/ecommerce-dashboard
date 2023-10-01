import { auth } from "@clerk/nextjs";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { ToastProvider } from "@/provider/toast-provide";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!store) {
    redirect("/");
  }
  return (
    <html lang="en">
      <body className={raleway.className}>
        <ToastProvider />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
