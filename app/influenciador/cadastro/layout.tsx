import { ProtectedRoute } from "@/components/auth/protected-route";
import { GuardInfluenciador } from "@/components/auth/guard-influenciador";

export default function InfluenciadorCadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <GuardInfluenciador>{children}</GuardInfluenciador>
    </ProtectedRoute>
  );
}
