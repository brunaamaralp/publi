"use client";

import { useState } from "react";

import { CalculoRpaPainel } from "@/components/pagamento/calculo-rpa-painel";
import { CheckoutSimuladoDialog } from "@/components/pagamento/checkout-simulado-dialog";
import { ResumoContratoDeposito } from "@/components/pagamento/resumo-contrato-deposito";
import { Button } from "@/components/ui/button";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
import { calcularRpa } from "@/lib/pagamento/pagamento-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type DepositoEmpresaProps = {
  contexto: ContratoPagamentoContexto;
  onDepositoConfirmado: (municipioRpa?: string) => void;
};

type EtapaDeposito = "resumo" | "rpa";

export function DepositoEmpresa({
  contexto,
  onDepositoConfirmado,
}: DepositoEmpresaProps) {
  const { contrato, influenciador } = contexto;
  const [etapa, setEtapa] = useState<EtapaDeposito>("resumo");
  const [municipio, setMunicipio] = useState(MUNICIPIO_PADRAO);
  const [checkoutAberto, setCheckoutAberto] = useState(false);

  const exigeRpa = influenciador.documentoTipo === "cpf";
  const calculoRpa = calcularRpa(contrato.valor);

  function iniciarDeposito() {
    if (exigeRpa) {
      setEtapa("rpa");
      return;
    }
    setCheckoutAberto(true);
  }

  function confirmarRpaEDepositar() {
    if (!municipio) return;
    setCheckoutAberto(true);
  }

  function handleSucessoCheckout() {
    onDepositoConfirmado(exigeRpa ? municipio : undefined);
    setEtapa("resumo");
  }

  if (etapa === "rpa") {
    return (
      <>
        <CalculoRpaPainel
          empresaNome={contexto.empresa.nome}
          calculo={calculoRpa}
          municipio={municipio}
          onMunicipioChange={setMunicipio}
          onConfirmar={confirmarRpaEDepositar}
          onVoltar={() => setEtapa("resumo")}
        />
        <CheckoutSimuladoDialog
          aberto={checkoutAberto}
          onOpenChange={setCheckoutAberto}
          titulo="Depósito confirmado"
          descricao="Registrando o valor em escrow na plataforma…"
          valor={contrato.valor}
          onSucesso={handleSucessoCheckout}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <ResumoContratoDeposito contexto={contexto} />
        <div className="rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-lilas-claro p-4 text-sm text-lilas-escuro">
          O valor ficará{" "}
          <span className="font-semibold">retido no escrow parceiro</span> até a
          entrega ser confirmada. Nem você nem o influenciador terão acesso
          direto ao dinheiro antes disso.
        </div>
        <Button
          type="button"
          variant="cta"
          className="w-full"
          onClick={iniciarDeposito}
        >
          Depositar valor na plataforma —{" "}
          <span className="font-data">{formatarMoeda(contrato.valor)}</span>
        </Button>
      </div>
      <CheckoutSimuladoDialog
        aberto={checkoutAberto}
        onOpenChange={setCheckoutAberto}
        titulo="Depósito confirmado"
        descricao="Registrando o valor em escrow na plataforma…"
        valor={contrato.valor}
        onSucesso={handleSucessoCheckout}
      />
    </>
  );
}

const MUNICIPIO_PADRAO = "São Paulo — SP";
