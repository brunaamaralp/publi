import { AgenciaProvider } from "@/lib/contexts/agencia-context";
import { AppShell } from "@/components/app/app-shell";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgenciaProvider>
      <AppShell>{children}</AppShell>
    </AgenciaProvider>
  );
}
