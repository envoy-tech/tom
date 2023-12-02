"use client";
import Header from "@/components/page-components/Header";
import Footer from "@/components/page-components/Footer";
import Mobile from "@/components/page-components/Mobile";
import useScreenSize from "@/hooks/useScreenSize";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, height } = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="h-full w-full flex flex-1 justify-center">
        {width >= 768 ? children : <Mobile />}
      </div>
      <Footer mode="dark" />
    </div>
  );
}
