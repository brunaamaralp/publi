import { GuardTipo } from "@/components/auth/guard-tipo";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["admin"]}
      mensagem="Esta área é exclusiva para administradores."
    >
      {children}
    </GuardTipo>
  );
}
