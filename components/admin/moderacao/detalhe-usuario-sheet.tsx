"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ImageIcon, Play } from "lucide-react";

import { BadgeTipoUsuario } from "@/components/admin/moderacao/badge-tipo-usuario";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { UsuarioPendenteModeracao } from "@/lib/mock-data/moderacao";
import { formatarDataCadastro } from "@/lib/moderacao/moderacao-utils";
import {
  creatorExibeNota,
  MIN_AVALIACOES_NOTA_PUBLICA,
} from "@/lib/empresa/creator-catalogo-types";
import type { Midia } from "@/lib/types";
import { Label } from "@/components/ui/label";

type SecaoProps = {
  titulo: string;
  children: ReactNode;
};

function Secao({ titulo, children }: SecaoProps) {
  return (
    <section className="border-b px-4 py-3 last:border-b-0">
      <h3 className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wide">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

function ListaChaveValor({
  itens,
}: {
  itens: { chave: string; valor: ReactNode }[];
}) {
  return (
    <dl className="grid gap-1.5">
      {itens.map((item) => (
        <div key={item.chave} className="grid grid-cols-[120px_1fr] gap-2 text-xs">
          <dt className="text-muted-foreground">{item.chave}</dt>
          <dd className="font-medium">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

type DetalheUsuarioSheetProps = {
  item: UsuarioPendenteModeracao | null;
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
  onAprovar: () => void;
  onRejeitar: () => void;
};

const CHECKLIST_INFLUENCIADOR_BASE = [
  {
    id: "dados",
    label: "Dados do perfil conferidos (nome, bio, categorias)",
  },
  {
    id: "metricas",
    label: "Print de métricas bate com os números declarados",
  },
  {
    id: "midia-visual",
    label:
      "Mídia revisada: nenhuma foto/vídeo expõe @, telefone ou contato escrito na imagem",
  },
  {
    id: "midia-falada",
    label:
      "Vídeos revisados: nenhum @ ou contato pessoal mencionado na fala (apresentação e trabalhos)",
  },
] as const;

export function DetalheUsuarioSheet({
  item,
  aberto,
  onAbertoChange,
  onAprovar,
  onRejeitar,
}: DetalheUsuarioSheetProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!aberto) setChecklist({});
  }, [aberto, item?.cadastro.usuario.id]);

  const itensChecklist = useMemo(() => {
    if (!item || item.tipo !== "influenciador") return [];
    return [...CHECKLIST_INFLUENCIADOR_BASE];
  }, [item]);

  const checklistCompleto =
    item?.tipo !== "influenciador" ||
    itensChecklist.every((c) => checklist[c.id]);

  if (!item) return null;

  const { usuario } = item.cadastro;
  const midiasInfluenciador: Midia[] =
    item.tipo === "influenciador" ? (item.cadastro.influenciador.midias ?? []) : [];

  return (
    <Sheet open={aberto} onOpenChange={onAbertoChange}>
      <SheetContent className="max-w-xl overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="bg-muted/30">
          <div className="flex items-start gap-2 pr-8">
            <SheetTitle className="text-base">
              {item.tipo === "influenciador"
                ? item.cadastro.influenciador.nome
                : item.tipo === "empresa"
                  ? item.cadastro.empresa.razaoSocial
                  : item.cadastro.agencia.razaoSocial}
            </SheetTitle>
            <BadgeTipoUsuario tipo={item.tipo} />
          </div>
          <SheetDescription>
            {usuario.email} · cadastro em{" "}
            {formatarDataCadastro(usuario.criadoEm)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Secao titulo="Conta">
            <ListaChaveValor
              itens={[
                { chave: "ID", valor: <span className="font-data">{usuario.id}</span> },
                { chave: "Status", valor: "pendente_verificacao" },
                { chave: "Tipo", valor: usuario.tipo },
              ]}
            />
          </Secao>

          {item.tipo === "influenciador" && (
            <>
              <Secao titulo="Perfil">
                <ListaChaveValor
                  itens={[
                    { chave: "Plano", valor: item.cadastro.influenciador.plano },
                    {
                      chave: "Avaliação",
                      valor: (() => {
                        const total =
                          item.cadastro.influenciador.totalAvaliacoes;
                        const media =
                          item.cadastro.influenciador.notaMediaAvaliacao;
                        if (
                          !creatorExibeNota({
                            totalAvaliacoes: total,
                            notaMediaAvaliacao: media,
                          })
                        ) {
                          return (
                            <span className="text-muted-foreground font-normal">
                              Novo no Publi (faltam{" "}
                              {Math.max(0, MIN_AVALIACOES_NOTA_PUBLICA - total)}{" "}
                              p/ nota pública)
                            </span>
                          );
                        }
                        return (
                          <span className="font-data">
                            {media!.toFixed(1)} ({total})
                          </span>
                        );
                      })(),
                    },
                    {
                      chave: "Bio",
                      valor: (
                        <p className="text-muted-foreground font-normal leading-relaxed">
                          {item.cadastro.influenciador.bio}
                        </p>
                      ),
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Categorias">
                <div className="flex flex-wrap gap-1">
                  {item.cadastro.categorias.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="text-[10px]">
                      {cat.nome}
                      <span className="text-muted-foreground ml-1">
                        ({cat.tipo})
                      </span>
                    </Badge>
                  ))}
                </div>
              </Secao>

              <Secao titulo="Métricas enviadas">
                <ListaChaveValor
                  itens={[
                    {
                      chave: "Seguidores",
                      valor: (
                        <span className="font-data">
                          {item.cadastro.metricaPerfil.seguidores.toLocaleString(
                            "pt-BR",
                          )}
                        </span>
                      ),
                    },
                    {
                      chave: "Engajamento",
                      valor: (
                        <span className="font-data">
                          {item.cadastro.metricaPerfil.engajamentoMedio}%
                        </span>
                      ),
                    },
                    {
                      chave: "Alcance médio",
                      valor: item.cadastro.metricaPerfil.alcanceMedio
                        ? `${item.cadastro.metricaPerfil.alcanceMedio.toLocaleString("pt-BR")}`
                        : "—",
                    },
                    {
                      chave: "Referência",
                      valor: item.cadastro.metricaPerfil.dataReferencia,
                    },
                    {
                      chave: "Validação",
                      valor: item.cadastro.metricaPerfil.statusValidacao,
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Print de audiência">
                <div className="border-border bg-muted/40 flex h-36 items-center justify-center rounded border border-dashed">
                  <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
                    <ImageIcon className="size-5 opacity-50" />
                    <span>Print enviado pelo influenciador</span>
                    <span className="font-data text-[10px] opacity-70">
                      {item.cadastro.metricaPerfil.printUrl}
                    </span>
                  </div>
                </div>
              </Secao>

              <Secao titulo="Audiência">
                <div className="space-y-1">
                  {item.cadastro.audiencia.map((linha, i) => (
                    <div
                      key={`${linha.dimensao}-${linha.valor}-${i}`}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground capitalize">
                        {linha.dimensao.replace("_", " ")} · {linha.valor}
                      </span>
                      <span className="font-data font-medium">
                        {linha.percentual}%
                      </span>
                    </div>
                  ))}
                </div>
              </Secao>

              {item.cadastro.equipamentos.length > 0 && (
                <Secao titulo="Equipamentos">
                  <ul className="space-y-1 text-xs">
                    {item.cadastro.equipamentos.map((eq) => (
                      <li key={eq.id}>
                        <span className="font-medium">{eq.tipo}</span>
                        {eq.descricao ? (
                          <span className="text-muted-foreground">
                            {" "}
                            — {eq.descricao}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Secao>
              )}

              <Secao titulo="Mídia do portfólio">
                {midiasInfluenciador.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Nenhuma mídia enviada ainda.
                  </p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {midiasInfluenciador.map((midia) => (
                      <li
                        key={midia.id}
                        className="overflow-hidden rounded border border-border"
                      >
                        <div className="bg-muted relative aspect-video">
                          {midia.tipo === "video" ? (
                            <video
                              src={midia.url}
                              controls
                              playsInline
                              preload="metadata"
                              className="size-full object-cover"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={midia.url}
                              alt={midia.legenda || "Mídia do portfólio"}
                              className="size-full object-cover"
                            />
                          )}
                          <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded bg-black/55 px-1 py-0.5 text-[9px] text-white">
                            {midia.tipo === "video" ? (
                              <Play className="size-2.5" aria-hidden />
                            ) : null}
                            {midia.categoria === "apresentacao"
                              ? "Apresentação"
                              : midia.tipo === "video"
                                ? "Vídeo"
                                : "Foto"}
                          </span>
                        </div>
                        {midia.legenda ? (
                          <p className="text-muted-foreground p-1.5 text-[10px] leading-snug">
                            {midia.legenda}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-muted-foreground mt-2 text-[10px] leading-relaxed">
                  Contato escrito ou falado em imagem/vídeo não é detectado
                  automaticamente — use o checklist abaixo.
                </p>
              </Secao>

              <Secao titulo="Checklist de aprovação">
                <ul className="space-y-2.5">
                  {itensChecklist.map((itemCheck) => (
                    <li key={itemCheck.id} className="flex items-start gap-2">
                      <Checkbox
                        id={`check-${itemCheck.id}`}
                        checked={checklist[itemCheck.id] === true}
                        onCheckedChange={(v) =>
                          setChecklist((prev) => ({
                            ...prev,
                            [itemCheck.id]: v === true,
                          }))
                        }
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={`check-${itemCheck.id}`}
                        className="cursor-pointer text-xs font-normal leading-snug"
                      >
                        {itemCheck.label}
                      </Label>
                    </li>
                  ))}
                </ul>
                {!checklistCompleto ? (
                  <p className="text-muted-foreground mt-2 text-[10px]">
                    Marque todos os itens antes de aprovar.
                  </p>
                ) : null}
              </Secao>
            </>
          )}

          {item.tipo === "empresa" && (
            <>
              <Secao titulo="Empresa">
                <ListaChaveValor
                  itens={[
                    {
                      chave: "Razão social",
                      valor: item.cadastro.empresa.razaoSocial,
                    },
                    {
                      chave: "Segmento",
                      valor: item.cadastro.empresa.segmento,
                    },
                    {
                      chave: "Orçamento médio",
                      valor: item.cadastro.orcamentoMedioCampanha
                        ? `R$ ${item.cadastro.orcamentoMedioCampanha.toLocaleString("pt-BR")}`
                        : "Não informado",
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Público-alvo">
                <div className="space-y-1">
                  {item.cadastro.publicoAlvo.map((linha, i) => (
                    <div key={`${linha.dimensao}-${i}`} className="text-xs">
                      <span className="text-muted-foreground capitalize">
                        {linha.dimensao.replace("_", " ")}:
                      </span>{" "}
                      <span className="font-medium">{linha.valor}</span>
                    </div>
                  ))}
                </div>
              </Secao>
            </>
          )}

          {item.tipo === "agencia" && (
            <>
              <Secao titulo="Agência">
                <ListaChaveValor
                  itens={[
                    {
                      chave: "Razão social",
                      valor: item.cadastro.agencia.razaoSocial,
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Clientes vinculados">
                <ul className="space-y-2">
                  {item.cadastro.clientesVinculados.map((cliente) => (
                    <li
                      key={cliente.id}
                      className="border-border rounded border px-2 py-1.5 text-xs"
                    >
                      <p className="font-medium">{cliente.razaoSocial}</p>
                      <p className="text-muted-foreground">{cliente.segmento}</p>
                    </li>
                  ))}
                </ul>
              </Secao>
            </>
          )}
        </div>

        <SheetFooter className="sticky bottom-0 bg-background">
          <Button variant="destructive" size="sm" onClick={onRejeitar}>
            Rejeitar
          </Button>
          <Button size="sm" onClick={onAprovar} disabled={!checklistCompleto}>
            Aprovar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
