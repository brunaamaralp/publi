import { GuardTipo } from "@/components/auth/guard-tipo";

export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardTipo
      permitidos={["empresa", "agencia", "influenciador", "admin"]}
      mensagem="Perfis públicos de creators estão disponíveis após o login."
    >
      {children}
    </GuardTipo>
  );
}
