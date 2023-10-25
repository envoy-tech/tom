import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import Toast from "@/components/ui-components/Toast";
import Footer from "@/components/page-components/Footer";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdventurUs",
  description: "Travel with us.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${poppins.className} h-full`}>
        <ReduxProvider>
          <AuthProvider>
            {children} <Toast />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
