"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ModalCelebracaoProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  titulo: string;
  subtitulo: string;
  cardLabel: string;
  cardValor: string;
  cardDetalhe: string;
  textoBotao: string;
  aoConfirmar: () => void;
};

const CONFETE = [
  {
    forma: "quadrado" as const,
    cor: "#39FF6A",
    className: "left-[10%] top-[8%]",
    size: 9,
    rot: -18,
    delay: "0ms",
  },
  {
    forma: "circulo" as const,
    cor: "#C9B8F5",
    className: "right-[12%] top-[10%]",
    size: 8,
    rot: 22,
    delay: "60ms",
  },
  {
    forma: "quadrado" as const,
    cor: "#F7F6F2",
    className: "left-[8%] bottom-[18%]",
    size: 7,
    rot: 12,
    delay: "120ms",
  },
  {
    forma: "circulo" as const,
    cor: "#39FF6A",
    className: "right-[9%] bottom-[22%]",
    size: 10,
    rot: -28,
    delay: "80ms",
  },
  {
    forma: "quadrado" as const,
    cor: "#C9B8F5",
    className: "left-[16%] top-[42%]",
    size: 8,
    rot: 35,
    delay: "140ms",
  },
  {
    forma: "circulo" as const,
    cor: "#F7F6F2",
    className: "right-[15%] top-[38%]",
    size: 7,
    rot: -12,
    delay: "40ms",
  },
];

export function ModalCelebracao({
  aberto,
  onOpenChange,
  titulo,
  subtitulo,
  cardLabel,
  cardValor,
  cardDetalhe,
  textoBotao,
  aoConfirmar,
}: ModalCelebracaoProps) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "overflow-hidden border-0 bg-[#1C2620] p-0 text-[#F7F6F2] shadow-2xl ring-0",
          "sm:max-w-sm",
          "data-open:zoom-in-95 data-closed:zoom-out-95",
        )}
      >
        <div className="relative px-6 pb-7 pt-10 sm:px-8">
          {aberto
            ? CONFETE.map((peca, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute z-0 modal-celebracao-confete",
                    peca.className,
                    peca.forma === "circulo" ? "rounded-full" : "rounded-[2px]",
                  )}
                  style={{
                    width: peca.size,
                    height: peca.size,
                    backgroundColor: peca.cor,
                    ["--confete-rot" as string]: `${peca.rot}deg`,
                    animationDelay: peca.delay,
                  }}
                />
              ))
            : null}

          <div className="relative z-10 flex flex-col items-center text-center">
            <div
              className={cn(
                "w-[min(100%,14.5rem)] -rotate-[4deg] rounded-[12px] bg-[#F7F6F2] px-5 py-6 text-[#1C2620]",
                "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55),0_8px_16px_-10px_rgba(0,0,0,0.35)]",
              )}
            >
              <p className="text-[0.7rem] font-medium tracking-wide text-[#1C2620]/70">
                {cardLabel}
              </p>
              <p className="font-display mt-2 text-3xl font-bold tracking-tight">
                <span className="font-data">{cardValor}</span>
              </p>
              <p className="mt-2 text-xs font-normal text-[#1C2620]/65">
                {cardDetalhe}
              </p>
            </div>

            <DialogTitle className="font-display mt-8 text-xl font-bold tracking-tight text-[#F7F6F2]">
              {titulo}
            </DialogTitle>
            <DialogDescription className="mt-2 max-w-[18rem] text-sm font-normal leading-relaxed text-[#B9C2BC]">
              {subtitulo}
            </DialogDescription>

            <button
              type="button"
              onClick={() => {
                aoConfirmar();
                onOpenChange(false);
              }}
              className={cn(
                "mt-7 inline-flex h-11 w-full max-w-[16rem] items-center justify-center rounded-button",
                "bg-[#F7F6F2] text-sm font-semibold text-[#1C2620]",
                "border border-[#F7F6F2]/90",
                "transition-[background-color,border-color,transform] duration-150",
                "hover:bg-white hover:border-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF6A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C2620]",
                "active:translate-y-px",
              )}
            >
              {textoBotao}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Presets dos três momentos de celebração. */
export function celebracaoContratoFechado(opts: {
  valorFormatado: string;
  nomeContraparte: string;
}): Pick<
  ModalCelebracaoProps,
  "titulo" | "subtitulo" | "cardLabel" | "cardValor" | "cardDetalhe" | "textoBotao"
> {
  return {
    titulo: "Fechado com sucesso",
    subtitulo: "O valor fica reservado até a entrega ser aprovada",
    cardLabel: "Contrato fechado",
    cardValor: opts.valorFormatado,
    cardDetalhe: `com ${opts.nomeContraparte}`,
    textoBotao: "Ver contrato",
  };
}

export function celebracaoPagamentoLiberado(opts: {
  valorFormatado: string;
}): Pick<
  ModalCelebracaoProps,
  "titulo" | "subtitulo" | "cardLabel" | "cardValor" | "cardDetalhe" | "textoBotao"
> {
  return {
    titulo: "Pagamento liberado",
    subtitulo: "O valor já está disponível para saque na sua carteira",
    cardLabel: "Pagamento liberado",
    cardValor: opts.valorFormatado,
    cardDetalhe: "Saldo disponível",
    textoBotao: "Ver saldo",
  };
}

export function celebracaoEntregaAprovada(opts: {
  valorFormatado: string;
  nomeContraparte: string;
  papel: "empresa" | "influenciador";
}): Pick<
  ModalCelebracaoProps,
  "titulo" | "subtitulo" | "cardLabel" | "cardValor" | "cardDetalhe" | "textoBotao"
> {
  const ehInfluenciador = opts.papel === "influenciador";
  return {
    titulo: ehInfluenciador
      ? "Sua entrega foi aprovada"
      : "Entrega aprovada",
    subtitulo: ehInfluenciador
      ? "A empresa confirmou o trabalho e o pagamento foi liberado"
      : "Você confirmou a entrega e o pagamento foi liberado ao influenciador",
    cardLabel: "Entrega aprovada",
    cardValor: opts.valorFormatado,
    cardDetalhe: `com ${opts.nomeContraparte}`,
    textoBotao: "Ver contrato",
  };
}
