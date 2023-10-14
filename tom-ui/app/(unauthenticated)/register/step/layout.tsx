export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative bg-gradient-to-tr from-advus-navyblue-500 to-advus-lightblue-500">
      {children}
    </div>
  );
}
