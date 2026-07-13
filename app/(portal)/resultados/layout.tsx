import { GuardTipo } from "@/components/auth/guard-tipo";

export default function ResultadosPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["empresa", "agencia"]}
      mensagem="Os resultados de campanha estão disponíveis para empresas e agências."
    >
      {children}
    </GuardTipo>
  );
}
