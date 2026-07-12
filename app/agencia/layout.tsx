import { ProtectedRoute } from "@/components/auth/protected-route";
import { AgenciaProvider } from "@/lib/contexts/agencia-context";

export default function AgenciaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AgenciaProvider>{children}</AgenciaProvider>
    </ProtectedRoute>
  );
}
