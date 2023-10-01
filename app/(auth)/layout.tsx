export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-[100vh] w-full">
      {children}
    </div>
  );
}
