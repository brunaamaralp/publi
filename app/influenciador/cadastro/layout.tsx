import { ProtectedRoute } from "@/components/auth/protected-route";

export default function InfluenciadorCadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
