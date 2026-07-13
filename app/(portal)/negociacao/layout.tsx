import { GuardTipo } from "@/components/auth/guard-tipo";

export default function NegociacaoPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["influenciador", "empresa", "agencia"]}
      mensagem="A negociação está disponível para influenciadores, empresas e agências."
    >
      {children}
    </GuardTipo>
  );
}
