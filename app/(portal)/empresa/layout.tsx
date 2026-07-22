import { GuardTipo } from "@/components/auth/guard-tipo";

export default function EmpresaPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["empresa"]}
      mensagem="Esta área é exclusiva para empresas."
    >
      {children}
    </GuardTipo>
  );
}
