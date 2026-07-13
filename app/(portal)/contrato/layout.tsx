import { GuardTipo } from "@/components/auth/guard-tipo";

export default function ContratoPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["influenciador", "empresa", "agencia"]}
      mensagem="O pagamento está disponível para influenciadores, empresas e agências."
    >
      {children}
    </GuardTipo>
  );
}
