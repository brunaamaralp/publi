import { AgenciaProvider } from "@/lib/contexts/agencia-context";

export default function ResultadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgenciaProvider>{children}</AgenciaProvider>;
}
