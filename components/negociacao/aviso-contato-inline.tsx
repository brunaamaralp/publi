import { ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type AvisoContatoInlineProps = {
  tipo: "alerta_termo" | "bloqueado_padrao";
  className?: string;
};

const CONTEUDO = {
  alerta_termo: {
    titulo: "Mantenha a negociação na plataforma",
    texto:
      "Identificamos um termo que pode indicar contato fora da Publi. Para registrar tudo com segurança, continue combinando os detalhes por aqui.",
    Icone: Sparkles,
  },
  bloqueado_padrao: {
    titulo: "Sua negociação está protegida",
    texto:
      "Não enviamos telefones, e-mails ou @ neste chat — assim sua conversa fica registrada e ambas as partes ficam cobertas pelos termos da plataforma.",
    Icone: ShieldCheck,
  },
} as const;

export function AvisoContatoInline({
  tipo,
  className,
}: AvisoContatoInlineProps) {
  const { titulo, texto, Icone } = CONTEUDO[tipo];
  const ehBloqueio = tipo === "bloqueado_padrao";

  return (
    <div
      role="status"
      className={cn(
        "mx-auto w-full max-w-md rounded-card border px-3 py-2.5 text-sm leading-relaxed",
        ehBloqueio
          ? "border-verde-carvao-claro bg-verde-carvao-escuro text-white"
          : "border-lilas/50 bg-lilas-claro text-lilas-escuro",
        className,
      )}
    >
      <div className="flex gap-2.5">
        <Icone
          className={cn(
            "mt-0.5 size-4 shrink-0",
            ehBloqueio ? "text-verde-neon" : "text-lilas-escuro/80",
          )}
          aria-hidden
        />
        <div className="space-y-0.5">
          <p className="font-medium">{titulo}</p>
          <p className={cn("font-normal", ehBloqueio ? "text-white/85" : "opacity-90")}>
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
}
