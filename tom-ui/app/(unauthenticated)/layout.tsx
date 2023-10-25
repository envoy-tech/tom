import Footer from "@/components/page-components/Footer";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col justify-between">
      {children}
      <Footer mode="light" />
    </div>
  );
}
