"use client";
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
    <div className="min-h-full flex flex-col justify-between">
      {width >= 768 ? children : <Mobile />}
      <Footer mode="light" />
    </div>
  );
}
