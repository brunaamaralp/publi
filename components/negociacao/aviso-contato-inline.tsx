import { AlertTriangle, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type AvisoContatoInlineProps = {
  tipo: "alerta_termo" | "bloqueado_padrao";
  className?: string;
  /** `inline` na thread da conversa; `central` no fluxo geral do chat */
  variante?: "inline" | "central";
};

const CONTEUDO = {
  alerta_termo: {
    titulo: "Detectamos um termo sensível na mensagem",
    texto:
      "A mensagem foi enviada, mas menciona algo que costuma indicar contato fora da plataforma. Para manter tudo registrado e proteger as duas partes, continue combinando os detalhes por aqui.",
    Icone: AlertTriangle,
  },
  bloqueado_padrao: {
    titulo: "Contato externo bloqueado — você está protegido(a)",
    texto:
      "Telefones, e-mails e @ não podem ser compartilhados neste chat. Isso garante que a conversa fique registrada e que ambas as partes tenham cobertura pelos termos da Publi.",
    Icone: ShieldCheck,
  },
} as const;

export function AvisoContatoInline({
  tipo,
  className,
  variante = "central",
}: AvisoContatoInlineProps) {
  const { titulo, texto, Icone } = CONTEUDO[tipo];
  const ehBloqueio = tipo === "bloqueado_padrao";

  return (
    <div
      role="status"
      className={cn(
        "rounded-card border px-3 py-2.5 text-sm leading-relaxed font-normal",
        variante === "central" && "mx-auto w-full max-w-md",
        variante === "inline" && "w-full",
        ehBloqueio
          ? "border-verde-carvao-claro bg-verde-carvao-escuro text-white"
          : "border-ambar/35 bg-lilas-claro text-lilas-escuro",
        className,
      )}
    >
      <div className="flex gap-2.5">
        <Icone
          className={cn(
            "mt-0.5 size-4 shrink-0",
            ehBloqueio ? "text-verde-neon" : "text-ambar",
          )}
          aria-hidden
        />
        <div className="space-y-1">
          <p className="font-medium">{titulo}</p>
          <p
            className={cn(
              "font-normal",
              ehBloqueio ? "text-white/85" : "text-lilas-escuro/90",
            )}
          >
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
}
