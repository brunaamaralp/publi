import { GuardTipo } from "@/components/auth/guard-tipo";

export default function MeuPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["influenciador"]}
      mensagem="Somente o dono do perfil pode editar o portfólio."
    >
      {children}
    </GuardTipo>
  );
}
