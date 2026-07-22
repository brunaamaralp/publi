"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AgendaDisponibilidade } from "@/components/influenciador/portfolio/agenda-disponibilidade";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatarDataAgendaLonga } from "@/lib/influenciador/agenda-utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  criarContratoPortfolio,
  type TermosContratacao,
} from "@/lib/influenciador/contratacao-direta";
import type { PortfolioInfluenciador } from "@/lib/influenciador/portfolio-types";
import { analisarTextoMensagem } from "@/lib/negociacao/filtro-contato";
import type { PacoteServico } from "@/lib/types";

export type PrefillCheckout = {
  escopo?: string;
  valor?: number;
  dataAgendada?: string;
  pacoteId?: string;
  pacoteNome?: string;
  instrucoesAdicionais?: string;
  origem?: TermosContratacao["origem"];
};

type CheckoutContratarDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  portfolio: PortfolioInfluenciador;
  pacote: PacoteServico | null;
  prefill?: PrefillCheckout | null;
  empresa?: { id?: string; nome?: string; usuarioId?: string };
  onContratoCriado?: (contratoId: string) => void;
};

export function CheckoutContratarDialog({
  aberto,
  onOpenChange,
  portfolio,
  pacote,
  prefill = null,
  empresa,
  onContratoCriado,
}: CheckoutContratarDialogProps) {
  const router = useRouter();
  const [dataAgendada, setDataAgendada] = useState<string | null>(null);
  const [instrucoes, setInstrucoes] = useState("");
  const [endereco, setEndereco] = useState("");
  const [nomeNf, setNomeNf] = useState("");
  const [avisoFiltro, setAvisoFiltro] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const nomePacote = prefill?.pacoteNome ?? pacote?.nome ?? "Serviço personalizado";
  const escopo =
    prefill?.escopo?.trim() ||
    (pacote
      ? [pacote.descricao, ...pacote.itensInclusos.map((i) => `• ${i}`)].join(
          "\n",
        )
      : "");
  const valor = prefill?.valor ?? pacote?.preco ?? 0;

  useEffect(() => {
    if (!aberto) return;
    setDataAgendada(prefill?.dataAgendada ?? null);
    setInstrucoes(prefill?.instrucoesAdicionais ?? "");
    setEndereco("");
    setNomeNf("");
    setAvisoFiltro(false);
    setErro(null);
    setEnviando(false);
  }, [aberto, prefill]);

  function validarTextoLivre(texto: string): boolean {
    if (!texto.trim()) return true;
    const analise = analisarTextoMensagem(texto);
    if (!analise.podeEnviar && analise.flag === "bloqueado_padrao") {
      setAvisoFiltro(true);
      return false;
    }
    setAvisoFiltro(false);
    return true;
  }

  function confirmarEDepositar() {
    if (!dataAgendada) {
      setErro("Selecione uma data disponível na agenda.");
      return;
    }
    if (!escopo.trim() || valor <= 0) {
      setErro("Escopo e valor são obrigatórios.");
      return;
    }
    if (!validarTextoLivre(instrucoes)) return;
    if (!validarTextoLivre(endereco)) return;
    if (!validarTextoLivre(nomeNf)) return;

    setErro(null);
    setEnviando(true);

    const termos: TermosContratacao = {
      escopo,
      valor,
      dataAgendada,
      pacoteId: prefill?.pacoteId ?? pacote?.id,
      pacoteNome: nomePacote,
      instrucoesAdicionais: instrucoes.trim() || undefined,
      logistica: {
        enderecoEntrega: endereco.trim() || undefined,
        nomeNotaFiscal: nomeNf.trim() || undefined,
      },
      origem: prefill?.origem ?? (prefill ? "portfolio_chat" : "portfolio_direto"),
    };

    const { contratoId } = criarContratoPortfolio({
      portfolio,
      termos,
      empresa,
    });

    onOpenChange(false);
    onContratoCriado?.(contratoId);
    router.push(`/contrato/${contratoId}/pagamento`);
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Revisar pedido</DialogTitle>
          <DialogDescription>
            Confirme o pacote e a data. O valor só é reservado no pagamento retido da
            plataforma — sem pagamento paralelo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-card border border-cinza-200 bg-white p-4">
            <p className="font-display font-bold">{nomePacote}</p>
            <p className="font-data mt-1 text-lg font-semibold">
              {formatarMoeda(valor)}
            </p>
            <p className="text-texto-secundario mt-2 whitespace-pre-wrap text-sm leading-relaxed font-normal">
              {escopo}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Data na agenda</Label>
            <AgendaDisponibilidade
              disponibilidade={portfolio.disponibilidade}
              modo="selecao"
              selecionavel
              ocultarCabecalho
              dataSelecionada={dataAgendada}
              onSelecionar={(d) => {
                setDataAgendada(d);
                setErro(null);
              }}
            />
            {dataAgendada ? (
              <p className="text-texto-secundario text-xs font-normal">
                Selecionado: {formatarDataAgendaLonga(dataAgendada)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrucoes-contratacao">
              Instruções adicionais{" "}
              <span className="text-texto-secundario font-normal">(opcional)</span>
            </Label>
            <Textarea
              id="instrucoes-contratacao"
              value={instrucoes}
              onChange={(e) => {
                setInstrucoes(e.target.value);
                setAvisoFiltro(false);
              }}
              placeholder="Detalhes de tom, referências, restrições de marca…"
              className="border-cinza-200 bg-white font-normal"
              rows={3}
            />
            <p className="text-texto-secundario text-xs font-normal">
              Mesmo filtro do chat: sem telefone, e-mail, @ ou chave PIX.
            </p>
          </div>

          <fieldset className="space-y-3 rounded-card border border-cinza-200 p-4">
            <legend className="px-1 text-sm font-medium">
              Logística da entrega
            </legend>
            <p className="text-texto-secundario text-xs font-normal">
              Campos estruturados do contrato — não use o chat para endereço ou
              dados fiscais.
            </p>
            <div className="space-y-2">
              <Label htmlFor="endereco-entrega">Endereço de entrega / envio</Label>
              <Input
                id="endereco-entrega"
                value={endereco}
                onChange={(e) => {
                  setEndereco(e.target.value);
                  setAvisoFiltro(false);
                }}
                placeholder="Opcional"
                className="border-cinza-200 bg-white font-normal"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome-nf">Nome para nota fiscal</Label>
              <Input
                id="nome-nf"
                value={nomeNf}
                onChange={(e) => {
                  setNomeNf(e.target.value);
                  setAvisoFiltro(false);
                }}
                placeholder="Opcional"
                className="border-cinza-200 bg-white font-normal"
                autoComplete="off"
              />
            </div>
          </fieldset>

          {avisoFiltro ? (
            <AvisoContatoInline tipo="bloqueado_padrao" variante="central" />
          ) : null}

          {erro ? (
            <p className="text-sm text-red-700" role="alert">
              {erro}
            </p>
          ) : null}

          <div className="rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-lilas-claro p-3 text-sm text-lilas-escuro">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="size-4" aria-hidden />
              Próximo passo: depósito em pagamento retido
            </span>
            <p className="mt-1 text-xs font-normal opacity-90">
              Ao confirmar, você vai ao mesmo fluxo de reserva na plataforma. A
              data só fica ocupada na agenda após o depósito.
            </p>
          </div>

          <Button
            type="button"
            variant="cta"
            className="w-full"
            disabled={enviando}
            onClick={confirmarEDepositar}
          >
            Confirmar e depositar —{" "}
            <span className="font-data">{formatarMoeda(valor)}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
