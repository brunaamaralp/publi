import { ModeracaoFlow } from "@/components/admin/moderacao/moderacao-flow";

export const metadata = {
  title: "Moderação | Admin",
  description: "Aprovar ou rejeitar perfis pendentes de verificação.",
};

export default function ModeracaoAdminPage() {
  return <ModeracaoFlow />;
}
