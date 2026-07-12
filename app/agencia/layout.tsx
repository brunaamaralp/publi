import { AgenciaProvider } from "@/lib/contexts/agencia-context";

export default function AgenciaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgenciaProvider>{children}</AgenciaProvider>;
}
