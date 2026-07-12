"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type CheckoutFase = "processando" | "sucesso";

type CheckoutSimuladoDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  titulo: string;
  descricao: string;
  valor: number;
  onSucesso: () => void;
};

export function CheckoutSimuladoDialog({
  aberto,
  onOpenChange,
  titulo,
  descricao,
  valor,
  onSucesso,
}: CheckoutSimuladoDialogProps) {
  const [fase, setFase] = useState<CheckoutFase>("processando");

  useEffect(() => {
    if (!aberto) {
      setFase("processando");
      return;
    }

    const processar = setTimeout(() => setFase("sucesso"), 1500);
    return () => clearTimeout(processar);
  }, [aberto]);

  useEffect(() => {
    if (!aberto || fase !== "sucesso") return;

    const fechar = setTimeout(() => {
      onOpenChange(false);
      onSucesso();
    }, 800);

    return () => clearTimeout(fechar);
  }, [aberto, fase, onOpenChange, onSucesso]);

  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (fase !== "processando") onOpenChange(open);
      }}
    >
      <DialogContent showCloseButton={fase !== "processando"}>
        <DialogHeader>
          <DialogTitle>
            {fase === "processando" ? "Processando pagamento" : titulo}
          </DialogTitle>
          <DialogDescription>
            {fase === "processando" ? descricao : "Operação concluída com sucesso."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-6">
          {fase === "processando" ? (
            <Loader2 className="text-primary size-10 animate-spin" aria-hidden />
          ) : (
            <div className="bg-verde-acao/10 flex size-12 items-center justify-center rounded-full">
              <ShieldCheck className="text-verde-acao size-6" aria-hidden />
            </div>
          )}
          <p className="font-data text-lg font-semibold">{formatarMoeda(valor)}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
