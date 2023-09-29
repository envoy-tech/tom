import Header from "@/components/page-components/Header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col justify-between">
      <Header />
      {children}
    </div>
  );
}
