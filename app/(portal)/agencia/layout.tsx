import { GuardTipo } from "@/components/auth/guard-tipo";

export default function AgenciaPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["agencia"]}
      mensagem="Esta área é exclusiva para contas de agência."
    >
      {children}
    </GuardTipo>
  );
}
