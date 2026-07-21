import { GuardTipo } from "@/components/auth/guard-tipo";

/** Área privada do influenciador (oportunidades, financeiro, portfólio editável…). */
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
