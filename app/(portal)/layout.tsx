import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/app/app-shell";
import { AgenciaProvider } from "@/lib/contexts/agencia-context";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AgenciaProvider>
        <AppShell>{children}</AppShell>
      </AgenciaProvider>
    </ProtectedRoute>
  );
}
