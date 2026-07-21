import { GuardTipo } from "@/components/auth/guard-tipo";

/**
 * Layout da área /influenciador — permite visitação pública de portfólios
 * por empresa/agência. Rotas privadas têm GuardTipo próprio.
 */
export default function InfluenciadorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["influenciador", "empresa", "agencia", "admin"]}
      mensagem="Faça login para acessar esta área."
    >
      {children}
    </GuardTipo>
  );
}
