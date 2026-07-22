"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Scale } from "lucide-react";
import { toast } from "sonner";

import { MensagemBolha } from "@/components/negociacao/mensagem-bolha";
import {
  BadgeStatusPagamentoRetido,
  ValorPagamentoRetidoDestaque,
} from "@/components/pagamento/pagamento-retido-ui";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  listarCasosDisputaAbertos,
  mensagensChatDoContrato,
  persistirEstadoDisputa,
  type CasoDisputa,
} from "@/lib/moderacao/disputas-utils";
import {
  decidirDisputaLiberarInfluenciador,
  decidirDisputaReembolsarEmpresa,
  obterCicloDoAlvo,
} from "@/lib/pagamento/pagamento-utils";
import { creditarSaldoDisponivel } from "@/lib/pagamento/saldo-influenciador";
import { valorRetidoPagamentoRetido } from "@/lib/pagamento/pagamento-utils";

type DisputasModeracaoProps = {
  /** Força remount/refresh da lista. */
  refreshKey?: number;
};

export function DisputasModeracao({ refreshKey = 0 }: DisputasModeracaoProps) {
  const [tick, setTick] = useState(0);
  const casos = useMemo(
    () => listarCasosDisputaAbertos(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey, tick],
  );
  const [selecionado, setSelecionado] = useState<CasoDisputa | null>(null);

  function fechar() {
    setSelecionado(null);
  }

  function liberar() {
    if (!selecionado) return;
    const retidoAntes = valorRetidoPagamentoRetido(selecionado.estado);
    const next = decidirDisputaLiberarInfluenciador(
      selecionado.estado,
      selecionado.alvo,
    );
    const liberado = retidoAntes - valorRetidoPagamentoRetido(next);
    if (liberado > 0) {
      creditarSaldoDisponivel(
        selecionado.contexto.influenciador.id,
        liberado,
      );
    }
    persistirEstadoDisputa(next);
    toast.success("Valor liberado para o influenciador.");
    fechar();
    setTick((t) => t + 1);
  }

  function reembolsar() {
    if (!selecionado) return;
    const next = decidirDisputaReembolsarEmpresa(
      selecionado.estado,
      selecionado.alvo,
      selecionado.contexto,
    );
    persistirEstadoDisputa(next);
    toast.message(
      next.contrato.status === "cancelado"
        ? "Reembolso feito — data liberada na agenda do influenciador."
        : "Valor reembolsado à empresa — pagamento retido encerrado neste item.",
    );
    fechar();
    setTick((t) => t + 1);
  }

  const ciclo = selecionado
    ? obterCicloDoAlvo(selecionado.estado, selecionado.alvo)
    : null;
  const mensagens = selecionado
    ? mensagensChatDoContrato(selecionado.contexto)
    : [];

  return (
    <div className="space-y-4 px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Scale className="text-ambar size-4" aria-hidden />
        <div>
          <h2 className="font-display text-sm font-bold">Disputas de entrega</h2>
          <p className="text-muted-foreground text-xs font-normal">
            {casos.length} caso{casos.length === 1 ? "" : "s"} aguardando decisão
            binária da Publi
          </p>
        </div>
      </div>

      {casos.length === 0 ? (
        <p className="text-muted-foreground rounded-card border border-dashed p-8 text-center text-sm">
          Nenhuma disputa aberta no momento.
        </p>
      ) : (
        <ul className="divide-y rounded-card border">
          {casos.map((caso) => {
            const c = obterCicloDoAlvo(caso.estado, caso.alvo);
            return (
              <li
                key={`${caso.contratoId}-${caso.alvo.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-sm">
                    {caso.contexto.demandaTitulo}
                  </p>
                  <p className="text-muted-foreground text-xs font-normal">
                    {caso.contexto.empresa.nome} ·{" "}
                    {caso.contexto.influenciador.nome} · {caso.tituloItem}
                  </p>
                  <p className="font-data text-xs">
                    {formatarMoeda(caso.valorItem)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeStatusPagamentoRetido status="em_disputa" />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelecionado(caso)}
                  >
                    Revisar
                  </Button>
                </div>
                {c.disputa?.reportadoEm ? (
                  <p className="text-muted-foreground w-full text-[10px]">
                    Reportado em{" "}
                    {new Date(c.disputa.reportadoEm).toLocaleString("pt-BR")}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <Sheet
        open={Boolean(selecionado)}
        onOpenChange={(open) => {
          if (!open) fechar();
        }}
      >
        <SheetContent className="max-w-xl overflow-y-auto p-0 sm:max-w-xl">
          {selecionado && ciclo ? (
            <>
              <SheetHeader className="bg-muted/30">
                <SheetTitle className="text-base">
                  {selecionado.contexto.demandaTitulo}
                </SheetTitle>
                <SheetDescription>
                  {selecionado.contexto.empresa.nome} ×{" "}
                  {selecionado.contexto.influenciador.nome}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4 py-3">
                <section className="space-y-2">
                  <h3 className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                    Contrato
                  </h3>
                  <ValorPagamentoRetidoDestaque
                    valor={selecionado.valorItem}
                    status="em_disputa"
                    tamanho="md"
                  />
                  <p className="text-sm leading-relaxed font-normal">
                    {selecionado.estado.contrato.escopo}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Prazo de entrega:{" "}
                    <span className="font-data">
                      {selecionado.estado.contrato.prazoEntrega}
                    </span>
                    {" · "}
                    Ciclos de ajuste:{" "}
                    <span className="font-data">{ciclo.ciclosAjusteUsados}</span>
                  </p>
                </section>

                <section className="space-y-2 border-t pt-3">
                  <h3 className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                    Prova de entrega
                  </h3>
                  {ciclo.linkComprovante || ciclo.descricaoEntrega ? (
                    <div className="space-y-2 text-sm">
                      {ciclo.linkComprovante ? (
                        <a
                          href={ciclo.linkComprovante}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lilas-escuro inline-flex items-center gap-1 font-medium hover:underline"
                        >
                          Ver conteúdo
                          <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Sem link de comprovante (não-entrega).
                        </p>
                      )}
                      {ciclo.descricaoEntrega ? (
                        <p className="font-normal leading-relaxed">
                          {ciclo.descricaoEntrega}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      Nenhuma entrega registrada neste item.
                    </p>
                  )}
                </section>

                <section className="space-y-2 border-t pt-3">
                  <h3 className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                    Reporte da empresa
                  </h3>
                  <p className="text-sm leading-relaxed font-normal">
                    {ciclo.disputa?.motivo}
                  </p>
                  {ciclo.disputa?.evidencia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ciclo.disputa.evidencia}
                      alt="Evidência do reporte"
                      className="aspect-video max-w-sm rounded border object-contain"
                    />
                  ) : null}
                </section>

                <section className="space-y-2 border-t pt-3">
                  <h3 className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
                    Histórico do chat (somente leitura)
                  </h3>
                  <div className="max-h-64 space-y-3 overflow-y-auto rounded-card border bg-fundo-pagina p-3">
                    {mensagens.map((msg) => (
                      <MensagemBolha
                        key={msg.id}
                        mensagem={msg}
                        ehRemetenteAtual={
                          msg.remetenteId ===
                          selecionado.contexto.empresa.usuarioId
                        }
                        nomeRemetente={
                          msg.remetenteId ===
                          selecionado.contexto.empresa.usuarioId
                            ? selecionado.contexto.empresa.nome
                            : selecionado.contexto.influenciador.nome
                        }
                      />
                    ))}
                  </div>
                </section>
              </div>

              <SheetFooter className="sticky bottom-0 bg-background">
                <Button variant="outline" size="sm" onClick={reembolsar}>
                  Reembolsar a empresa
                </Button>
                <Button size="sm" variant="cta" onClick={liberar}>
                  Liberar para o influenciador
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
