import { ProtectedRoute } from "@/components/auth/protected-route";

export default function EmpresaCadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
