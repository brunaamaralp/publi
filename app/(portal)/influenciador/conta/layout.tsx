import { GuardTipo } from "@/components/auth/guard-tipo";
import { ContaConfiguracoesShell } from "@/components/influenciador/conta/conta-configuracoes-shell";

export default function ContaInfluenciadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["influenciador"]}
      mensagem="Esta área é exclusiva para contas de influenciador."
    >
      <ContaConfiguracoesShell>{children}</ContaConfiguracoesShell>
    </GuardTipo>
  );
}
