"use client";

import { useMemo, useState } from "react";
import { Banknote, Lock, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  calcularSaldoInfluenciador,
  sacarSaldoDisponivel,
} from "@/lib/pagamento/saldo-influenciador";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import type { SaldoInfluenciador } from "@/lib/pagamento/pagamento-types";

type PainelSaldoSaqueProps = {
  influenciadorId?: string;
};

export function PainelSaldoSaque({
  influenciadorId = INFLUENCIADOR_MOCK_ID,
}: PainelSaldoSaqueProps) {
  const [saldo, setSaldo] = useState<SaldoInfluenciador>(() =>
    calcularSaldoInfluenciador(influenciadorId),
  );
  const [valorSaque, setValorSaque] = useState("");
  const valorNum = useMemo(() => Number(valorSaque) || 0, [valorSaque]);

  function atualizar() {
    setSaldo(calcularSaldoInfluenciador(influenciadorId));
  }

  function sacar() {
    const resultado = sacarSaldoDisponivel(influenciadorId, valorNum);
    if (!resultado.ok) {
      toast.error(resultado.motivo);
      return;
    }
    toast.success("Saque solicitado — valor debitado do saldo disponível.");
    setValorSaque("");
    atualizar();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="border-verde-neon/30 bg-white">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <Wallet className="size-3.5" aria-hidden />
            Saldo disponível
          </CardDescription>
          <CardTitle className="font-data text-3xl font-bold tracking-tight text-verde-acao">
            {formatarMoeda(saldo.disponivel)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-texto-secundario text-xs font-normal">
            Valores com entrega aprovada (manual ou automática). Só este saldo
            pode ser sacado.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <Lock className="size-3.5" aria-hidden />
            Valor retido no pagamento retido
          </CardDescription>
          <CardTitle className="font-data text-2xl font-bold">
            {formatarMoeda(saldo.retido)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-texto-secundario text-xs font-normal">
            Contratos/aditivos com entrega ainda não aprovada. Não entra no
            saque.
          </p>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <Banknote className="size-3.5" aria-hidden />
            Solicitar saque
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="valor-saque">Valor (R$)</Label>
            <Input
              id="valor-saque"
              type="number"
              min={0}
              step={0.01}
              className="font-data"
              value={valorSaque}
              onChange={(e) => setValorSaque(e.target.value)}
              placeholder="0,00"
            />
          </div>
          <Button
            type="button"
            variant="cta"
            className="w-full"
            disabled={saldo.disponivel <= 0 || valorNum <= 0}
            onClick={sacar}
          >
            Sacar saldo disponível
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
