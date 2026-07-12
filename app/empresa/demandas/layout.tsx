import { AgenciaProvider } from "@/lib/contexts/agencia-context";

export default function EmpresaDemandasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgenciaProvider>{children}</AgenciaProvider>;
}
