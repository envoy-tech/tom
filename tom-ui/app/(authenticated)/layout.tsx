import Header from "@/components/page-components/Header";
import Footer from "@/components/page-components/Footer";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="h-full w-full flex flex-1">{children}</div>
      <Footer mode="dark" />
    </div>
  );
}
