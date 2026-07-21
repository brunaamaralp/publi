import { GuardTipo } from "@/components/auth/guard-tipo";

export default function InfluenciadorAreaPrivadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["influenciador"]}
      mensagem="Esta área é exclusiva para contas de influenciador."
    >
      {children}
    </GuardTipo>
  );
}
