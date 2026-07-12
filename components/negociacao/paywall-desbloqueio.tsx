"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

import { PerfilInfluenciadorResumoCard } from "@/components/negociacao/perfil-influenciador-resumo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type PaywallDesbloqueioProps = {
  contexto: NegociacaoContexto;
  onDesbloqueado: () => void;
};

type CheckoutFase = "idle" | "processando" | "sucesso";

export function PaywallDesbloqueio({
  contexto,
  onDesbloqueado,
}: PaywallDesbloqueioProps) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [fase, setFase] = useState<CheckoutFase>("idle");

  useEffect(() => {
    if (fase !== "processando") return;

    const timer = setTimeout(() => {
      setFase("sucesso");
    }, 1500);

    return () => clearTimeout(timer);
  }, [fase]);

  useEffect(() => {
    if (fase !== "sucesso") return;

    const timer = setTimeout(() => {
      setDialogAberto(false);
      onDesbloqueado();
    }, 800);

    return () => clearTimeout(timer);
  }, [fase, onDesbloqueado]);

  function iniciarCheckout() {
    setFase("processando");
    setDialogAberto(true);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="text-center">
        <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
          <Lock className="text-muted-foreground size-5" aria-hidden />
        </div>
        <h2 className="font-display text-xl font-semibold">
          Conversa bloqueada
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Para iniciar a negociação com{" "}
          <span className="text-foreground font-medium">
            {contexto.influenciador.nome}
          </span>
          , pague a taxa de desbloqueio deste match.
        </p>
      </div>

      <PerfilInfluenciadorResumoCard contexto={contexto} />

      <div className="banner-informativo space-y-3 rounded-card p-4">
        <p className="text-sm">
          A taxa garante contato seguro pela plataforma e registro da negociação
          para ambas as partes.
        </p>
        <Button type="button" className="w-full" onClick={iniciarCheckout}>
          Desbloquear conversa — {formatarMoeda(contexto.taxaDesbloqueio)}
        </Button>
      </div>

      <Dialog
        open={dialogAberto}
        onOpenChange={(open) => {
          if (!open && fase !== "processando") setDialogAberto(open);
        }}
      >
        <DialogContent showCloseButton={fase !== "processando"}>
          <DialogHeader>
            <DialogTitle>
              {fase === "processando"
                ? "Processando pagamento"
                : "Pagamento confirmado"}
            </DialogTitle>
            <DialogDescription>
              {fase === "processando"
                ? "Aguarde enquanto simulamos o checkout da taxa de desbloqueio."
                : "Conversa liberada! Redirecionando para o chat…"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-6">
            {fase === "processando" ? (
              <Loader2
                className="text-primary size-10 animate-spin"
                aria-hidden
              />
            ) : (
              <div className="bg-verde-acao/10 flex size-12 items-center justify-center rounded-full">
                <ShieldCheck className="text-verde-acao size-6" aria-hidden />
              </div>
            )}
            <p className="text-muted-foreground text-center text-sm">
              {fase === "processando"
                ? formatarMoeda(contexto.taxaDesbloqueio)
                : "Desbloqueio realizado com sucesso"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
