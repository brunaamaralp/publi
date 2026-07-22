"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CampoTextoFiltrado } from "@/components/influenciador/portfolio/campo-texto-filtrado";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { analisarTextoLivrePortfolio } from "@/lib/negociacao/filtro-contato";
import type { PapelPagamento } from "@/lib/pagamento/pagamento-types";
import {
  podeSolicitarAditivo,
  itemPagamentoRetidoDoAlvo,
} from "@/lib/pagamento/pagamento-utils";
import type { PagamentoFluxoEstado } from "@/lib/pagamento/pagamento-types";
import type { Aditivo } from "@/lib/types";

type ServicoAdicionalPainelProps = {
  estado: PagamentoFluxoEstado;
  papel: PapelPagamento;
  onSolicitar: (dados: {
    escopo: string;
    valor: number;
    prazoEntrega: string;
  }) => void;
  onAceitar: (aditivoId: string) => void;
  onRecusar: (aditivoId: string) => void;
  onDepositar: (aditivoId: string) => void;
};

export function ServicoAdicionalPainel({
  estado,
  papel,
  onSolicitar,
  onAceitar,
  onRecusar,
  onDepositar,
}: ServicoAdicionalPainelProps) {
  const [aberto, setAberto] = useState(false);
  const [escopo, setEscopo] = useState("");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  const [aviso, setAviso] = useState(false);

  const podePedir = papel === "empresa" && podeSolicitarAditivo(estado.contrato);
  const aditivos = estado.aditivos;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const analise = analisarTextoLivrePortfolio(escopo);
    if (!analise.podeEnviar) {
      setAviso(true);
      return;
    }
    const valorNum = Number(valor.replace(",", "."));
    if (!escopo.trim() || !Number.isFinite(valorNum) || valorNum <= 0 || !prazo) {
      return;
    }
    onSolicitar({
      escopo: escopo.trim(),
      valor: valorNum,
      prazoEntrega: prazo,
    });
    setEscopo("");
    setValor("");
    setPrazo("");
    setAviso(false);
    setAberto(false);
  }

  if (!podePedir && aditivos.length === 0) return null;

  return (
    <div className="secao-editavel space-y-4 border-l-[3px] border-l-cinza-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold">Serviços adicionais</h2>
          <p className="text-texto-secundario mt-1 text-sm font-normal">
            Escopo extra com depósito separado no pagamento retido — não mistura com o valor
            original.
          </p>
        </div>
        {podePedir && !aberto ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAberto(true)}
          >
            <Plus className="size-4" aria-hidden />
            Solicitar serviço adicional
          </Button>
        ) : null}
      </div>

      {aberto ? (
        <form onSubmit={enviar} className="space-y-3 rounded-card border border-cinza-200 bg-white p-3">
          <div className="space-y-2">
            <Label htmlFor="adit-escopo">Escopo</Label>
            <CampoTextoFiltrado
              id="adit-escopo"
              value={escopo}
              onChange={setEscopo}
              multiline
              rows={3}
              placeholder="Descreva o serviço extra — sem @, telefone ou PIX"
            />
            {aviso ? (
              <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="adit-valor">Valor (R$)</Label>
              <Input
                id="adit-valor"
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adit-prazo">Prazo</Label>
              <Input
                id="adit-prazo"
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="cta">
              Enviar proposta
            </Button>
          </div>
        </form>
      ) : null}

      {aditivos.length > 0 ? (
        <ul className="space-y-3">
          {aditivos.map((aditivo) => (
            <AditivoCard
              key={aditivo.id}
              aditivo={aditivo}
              estado={estado}
              papel={papel}
              onAceitar={onAceitar}
              onRecusar={onRecusar}
              onDepositar={onDepositar}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function AditivoCard({
  aditivo,
  estado,
  papel,
  onAceitar,
  onRecusar,
  onDepositar,
}: {
  aditivo: Aditivo;
  estado: PagamentoFluxoEstado;
  papel: PapelPagamento;
  onAceitar: (id: string) => void;
  onRecusar: (id: string) => void;
  onDepositar: (id: string) => void;
}) {
  const item = itemPagamentoRetidoDoAlvo(estado, {
    origem: "aditivo",
    id: aditivo.id,
  });
  const depositado = Boolean(item);

  return (
    <li className="rounded-card border border-cinza-200 bg-white p-3 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium">{formatarMoeda(aditivo.valor)}</p>
        <span className="text-texto-secundario text-xs capitalize">
          {aditivo.status === "proposto"
            ? "Aguardando aceite"
            : aditivo.status === "aceito"
              ? "Aceito — aguardando depósito"
              : aditivo.status === "ativo"
                ? depositado
                  ? `Pagamento retido: ${item?.status}`
                  : "Ativo"
                : "Cancelado"}
        </span>
      </div>
      <p className="text-texto-secundario mt-1 whitespace-pre-wrap font-normal leading-relaxed">
        {aditivo.escopo}
      </p>
      <p className="text-texto-secundario mt-1 text-xs font-normal">
        Prazo: {aditivo.prazoEntrega}
      </p>

      {aditivo.status === "proposto" && papel === "influenciador" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="cta"
            size="sm"
            onClick={() => onAceitar(aditivo.id)}
          >
            Aceitar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRecusar(aditivo.id)}
          >
            Recusar
          </Button>
        </div>
      ) : null}

      {aditivo.status === "aceito" && papel === "empresa" ? (
        <Button
          type="button"
          variant="cta"
          size="sm"
          className="mt-3"
          onClick={() => onDepositar(aditivo.id)}
        >
          Depositar no pagamento retido
        </Button>
      ) : null}
    </li>
  );
}
