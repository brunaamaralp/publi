"use client";

import { useRef, useState } from "react";
import { Camera, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SecoesPerfilPortfolio } from "@/components/influenciador/portfolio/secoes-perfil-portfolio";
import { PortfolioView } from "@/components/influenciador/portfolio/portfolio-view";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DIAS_SEMANA,
  ehSomenteModelo,
  normalizarTiposAtuacao,
} from "@/lib/influenciador/atuacao-utils";
import {
  carregarPerfilInfluenciador,
  marcarSecaoCompleta,
  salvarPerfilInfluenciador,
} from "@/lib/influenciador/perfil-storage";
import { enfileirarInfluenciadorParaModeracao } from "@/lib/moderacao/moderacao-utils";
import { CATEGORIAS_CATALOGO } from "@/lib/mock-data/categorias";
import {
  carregarPortfolioPorId,
  salvarPortfolio,
} from "@/lib/influenciador/portfolio-storage";
import {
  LABELS_PLATAFORMA_REDE,
  novoIdLocal,
  type PortfolioInfluenciador,
  type RedeSocialPortfolio,
  type TrabalhoAnterior,
} from "@/lib/influenciador/portfolio-types";
import type { DiaSemana, TipoAtuacao } from "@/lib/types/influenciador";
import { cn } from "@/lib/utils";

type PortfolioEditorProps = {
  inicial: PortfolioInfluenciador;
};

function comTiposPadrao(
  portfolio: PortfolioInfluenciador,
): PortfolioInfluenciador {
  return {
    ...portfolio,
    tiposAtuacao: normalizarTiposAtuacao(portfolio.tiposAtuacao),
  };
}

export function PortfolioEditor({ inicial }: PortfolioEditorProps) {
  const [draft, setDraft] = useState<PortfolioInfluenciador>(() =>
    comTiposPadrao(inicial),
  );
  const [salvando, setSalvando] = useState(false);
  const [preview, setPreview] = useState(false);
  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const fotoCapaRef = useRef<HTMLInputElement>(null);

  function patch(partial: Partial<PortfolioInfluenciador>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function onFile(
    file: File | null,
    campo: "fotoPerfilUrl" | "fotoCapaUrl",
  ) {
    const atual = draft[campo];
    if (atual?.startsWith("blob:")) URL.revokeObjectURL(atual);
    if (!file) {
      patch({ [campo]: null });
      return;
    }
    patch({ [campo]: URL.createObjectURL(file) });
  }

  function salvar() {
    if (draft.nome.trim().length < 2) {
      toast.error("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    if (draft.bio.trim().length < 20) {
      toast.error("A bio precisa ter pelo menos 20 caracteres.");
      return;
    }
    if (
      draft.tiposAtuacao.includes("modelo") &&
      (!draft.disponibilidade || draft.disponibilidade.diasSemana.length === 0)
    ) {
      toast.error("Informe ao menos um dia de disponibilidade como modelo.");
      return;
    }
    setSalvando(true);
    const next = comTiposPadrao(draft);
    salvarPortfolio(next);
    sincronizarAtuacaoNoPerfil(next);

    const perfil = carregarPerfilInfluenciador(next.usuarioId);
    if (perfil && ehSomenteModelo(next.tiposAtuacao)) {
      const trabalhosOk = next.trabalhos.filter(
        (t) => t.titulo.trim() || t.marca.trim(),
      ).length;
      if (trabalhosOk > 0) {
        marcarSecaoCompleta(next.usuarioId, "metricas");
        enfileirarInfluenciadorParaModeracao(perfil);
      }
    }

    toast.success("Portfólio atualizado.");
    setSalvando(false);
  }

  function sincronizarAtuacaoNoPerfil(portfolio: PortfolioInfluenciador) {
    const perfil = carregarPerfilInfluenciador(portfolio.usuarioId);
    if (!perfil) return;
    const tipos = normalizarTiposAtuacao(portfolio.tiposAtuacao);
    salvarPerfilInfluenciador(portfolio.usuarioId, {
      ...perfil,
      influenciador: {
        ...perfil.influenciador,
        tiposAtuacao: tipos,
        ...(tipos.includes("modelo") && portfolio.disponibilidade
          ? { disponibilidade: portfolio.disponibilidade }
          : { disponibilidade: undefined }),
      },
    });
  }

  function verComoVisitante() {
    salvarPortfolio(draft);
    window.open(`/influenciador/${draft.id}`, "_blank", "noopener,noreferrer");
  }

  function addRede() {
    const nova: RedeSocialPortfolio = {
      id: novoIdLocal("rede"),
      plataforma: "instagram",
      handle: "",
    };
    patch({ redes: [...draft.redes, nova] });
  }

  function addTrabalho() {
    const novo: TrabalhoAnterior = {
      id: novoIdLocal("trab"),
      titulo: "",
      marca: "",
      tipoConteudo: "Reels",
      link: "",
    };
    patch({ trabalhos: [...draft.trabalhos, novo] });
  }

  function toggleNicho(nichoId: string) {
    const tem = draft.nichoIds.includes(nichoId);
    patch({
      nichoIds: tem
        ? draft.nichoIds.filter((id) => id !== nichoId)
        : [...draft.nichoIds, nichoId],
    });
  }

  if (preview) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-texto-secundario text-sm">
            Pré-visualização (como visitante — sem handles de rede)
          </p>
          <Button type="button" variant="outline" onClick={() => setPreview(false)}>
            Voltar à edição
          </Button>
        </div>
        <PortfolioView portfolio={draft} ocultarHandlesRedes />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-texto-secundario text-sm font-medium">Perfil</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
            Meu portfólio
          </h1>
          <p className="text-texto-secundario mt-2 max-w-xl text-sm font-normal">
            Edite sua vitrine pública, métricas e preços. Empresas veem esta
            página ao clicar no seu card na busca.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreview(true)}
          >
            <Eye className="size-4" aria-hidden />
            Preview local
          </Button>
          <Button type="button" variant="outline" onClick={verComoVisitante}>
            Ver como visitante vê
          </Button>
          <Button
            type="button"
            variant="cta"
            disabled={salvando}
            onClick={salvar}
          >
            Salvar
          </Button>
        </div>
      </header>

      {/* Capa + foto */}
      <section className="secao-editavel space-y-4 ring-0">
        <div>
          <Label>Foto de capa</Label>
          <div
            className="relative mt-2 flex h-32 items-center justify-center overflow-hidden rounded-card bg-verde-carvao"
            style={
              draft.fotoCapaUrl
                ? {
                    backgroundImage: `url(${draft.fotoCapaUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <input
              ref={fotoCapaRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) =>
                onFile(e.target.files?.[0] ?? null, "fotoCapaUrl")
              }
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fotoCapaRef.current?.click()}
            >
              <Camera className="size-4" aria-hidden />
              {draft.fotoCapaUrl ? "Trocar capa" : "Enviar capa"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            className="border-border bg-muted relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border"
            style={
              draft.fotoPerfilUrl
                ? {
                    backgroundImage: `url(${draft.fotoPerfilUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {!draft.fotoPerfilUrl ? (
              <Camera className="text-muted-foreground size-6" aria-hidden />
            ) : null}
          </div>
          <div>
            <Label>Foto de perfil</Label>
            <input
              ref={fotoPerfilRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) =>
                onFile(e.target.files?.[0] ?? null, "fotoPerfilUrl")
              }
            />
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fotoPerfilRef.current?.click()}
              >
                Enviar foto
              </Button>
              {draft.fotoPerfilUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onFile(null, "fotoPerfilUrl")}
                >
                  Remover
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Dados básicos */}
      <section className="secao-editavel space-y-4 ring-0">
        <h2 className="font-display text-sm font-bold">Dados básicos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="pf-nome">Nome</Label>
            <Input
              id="pf-nome"
              value={draft.nome}
              onChange={(e) => patch({ nome: e.target.value })}
              className="border-cinza-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-handle">Handle</Label>
            <Input
              id="pf-handle"
              value={draft.handle}
              onChange={(e) => patch({ handle: e.target.value })}
              placeholder="@seuuser"
              className="border-cinza-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-cidade">Cidade</Label>
            <Input
              id="pf-cidade"
              value={draft.cidade}
              onChange={(e) => patch({ cidade: e.target.value })}
              className="border-cinza-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-estado">Estado (UF)</Label>
            <Input
              id="pf-estado"
              value={draft.estado}
              onChange={(e) =>
                patch({ estado: e.target.value.toUpperCase().slice(0, 2) })
              }
              maxLength={2}
              className="border-cinza-200 bg-white"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="pf-bio">Bio</Label>
            <Textarea
              id="pf-bio"
              value={draft.bio}
              onChange={(e) => patch({ bio: e.target.value })}
              rows={4}
              className="border-cinza-200 bg-white"
            />
            <p className="text-texto-secundario text-xs">
              {draft.bio.length}/20 caracteres mínimos
            </p>
          </div>
        </div>
      </section>

      {/* Atuação como modelo */}
      <SecaoAtuacaoModelo draft={draft} onPatch={patch} />

      {/* Nichos */}
      <section className="secao-editavel space-y-3 ring-0">
        <h2 className="font-display text-sm font-bold">Nicho(s)</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS_CATALOGO.map((cat) => {
            const ativo = draft.nichoIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleNicho(cat.id)}
                className={cn(
                  buttonVariants({
                    variant: ativo ? "cta" : "outline",
                    size: "sm",
                  }),
                )}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>
      </section>

      {/* Redes */}
      <section className="secao-editavel space-y-4 ring-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-bold">Redes sociais</h2>
            <p className="text-texto-secundario text-xs font-normal">
              No modo público só aparece a plataforma — sem link de DM.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addRede}>
            <Plus className="size-4" aria-hidden />
            Adicionar
          </Button>
        </div>
        <ul className="space-y-3">
          {draft.redes.map((rede) => (
            <li
              key={rede.id}
              className="grid gap-2 rounded-card border border-cinza-200 p-3 sm:grid-cols-[140px_1fr_auto]"
            >
              <Select
                value={rede.plataforma}
                onValueChange={(valor) => {
                  if (!valor) return;
                  patch({
                    redes: draft.redes.map((r) =>
                      r.id === rede.id
                        ? {
                            ...r,
                            plataforma:
                              valor as RedeSocialPortfolio["plataforma"],
                          }
                        : r,
                    ),
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(LABELS_PLATAFORMA_REDE) as RedeSocialPortfolio["plataforma"][]
                  ).map((key) => (
                    <SelectItem key={key} value={key}>
                      {LABELS_PLATAFORMA_REDE[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={rede.handle}
                placeholder="@seuuser"
                onChange={(e) =>
                  patch({
                    redes: draft.redes.map((r) =>
                      r.id === rede.id ? { ...r, handle: e.target.value } : r,
                    ),
                  })
                }
                className="border-cinza-200 bg-white"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  patch({
                    redes: draft.redes.filter((r) => r.id !== rede.id),
                  })
                }
                aria-label="Remover rede"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* Métricas, equipamentos, tabela de preços e pacotes (pós-cadastro) */}
      <SecoesPerfilPortfolio
        onPerfilAtualizado={() => {
          const atualizado = carregarPortfolioPorId(draft.id);
          if (!atualizado) return;
          setDraft((prev) => ({
            ...prev,
            seguidores: atualizado.seguidores,
            engajamentoMedio: atualizado.engajamentoMedio,
            pacotes: atualizado.pacotes,
            plano: atualizado.plano,
          }));
        }}
      />

      {/* Trabalhos */}
      <section id="trabalhos" className="secao-editavel space-y-4 ring-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-bold">Trabalhos anteriores</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTrabalho}
          >
            <Plus className="size-4" aria-hidden />
            Adicionar
          </Button>
        </div>
        <ul className="space-y-3">
          {draft.trabalhos.map((trab) => (
            <li
              key={trab.id}
              className="grid gap-3 rounded-card border border-cinza-200 p-4 sm:grid-cols-2"
            >
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={trab.titulo}
                  onChange={(e) =>
                    patch({
                      trabalhos: draft.trabalhos.map((t) =>
                        t.id === trab.id
                          ? { ...t, titulo: e.target.value }
                          : t,
                      ),
                    })
                  }
                  className="border-cinza-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input
                  value={trab.marca}
                  onChange={(e) =>
                    patch({
                      trabalhos: draft.trabalhos.map((t) =>
                        t.id === trab.id ? { ...t, marca: e.target.value } : t,
                      ),
                    })
                  }
                  className="border-cinza-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de conteúdo</Label>
                <Input
                  value={trab.tipoConteudo}
                  onChange={(e) =>
                    patch({
                      trabalhos: draft.trabalhos.map((t) =>
                        t.id === trab.id
                          ? { ...t, tipoConteudo: e.target.value }
                          : t,
                      ),
                    })
                  }
                  className="border-cinza-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Link (opcional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={trab.link ?? ""}
                    onChange={(e) =>
                      patch({
                        trabalhos: draft.trabalhos.map((t) =>
                          t.id === trab.id
                            ? { ...t, link: e.target.value || undefined }
                            : t,
                        ),
                      })
                    }
                    placeholder="https://"
                    className="border-cinza-200 bg-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      patch({
                        trabalhos: draft.trabalhos.filter(
                          (t) => t.id !== trab.id,
                        ),
                      })
                    }
                    aria-label="Remover trabalho"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end gap-2 pb-8">
        <Button type="button" variant="outline" onClick={verComoVisitante}>
          Ver como visitante vê
        </Button>
        <Button type="button" variant="cta" disabled={salvando} onClick={salvar}>
          Salvar portfólio
        </Button>
      </div>
    </div>
  );
}

function SecaoAtuacaoModelo({
  draft,
  onPatch,
}: {
  draft: PortfolioInfluenciador;
  onPatch: (partial: Partial<PortfolioInfluenciador>) => void;
}) {
  const disponivelComoModelo = draft.tiposAtuacao.includes("modelo");
  const dias = draft.disponibilidade?.diasSemana ?? [];

  function setModelo(checked: boolean) {
    let tiposAtuacao: TipoAtuacao[];
    if (checked) {
      tiposAtuacao = Array.from(
        new Set<TipoAtuacao>([...draft.tiposAtuacao, "modelo"]),
      );
      if (!tiposAtuacao.includes("influenciador") && tiposAtuacao.length === 1) {
        // Mantém influenciador no portfólio a menos que a pessoa remova depois
        // via fluxo de cadastro “só modelo” — aqui o default é híbrido.
        tiposAtuacao = ["influenciador", "modelo"];
      }
    } else {
      tiposAtuacao = draft.tiposAtuacao.filter((t) => t !== "modelo");
      if (tiposAtuacao.length === 0) tiposAtuacao = ["influenciador"];
    }
    onPatch({
      tiposAtuacao,
      disponibilidade: checked
        ? draft.disponibilidade ?? { diasSemana: [] }
        : undefined,
    });
  }

  function toggleDia(dia: DiaSemana) {
    const atuais = draft.disponibilidade?.diasSemana ?? [];
    const next = atuais.includes(dia)
      ? atuais.filter((d) => d !== dia)
      : [...atuais, dia];
    onPatch({
      disponibilidade: {
        diasSemana: next,
        observacao: draft.disponibilidade?.observacao,
      },
    });
  }

  return (
    <section className="secao-editavel space-y-4 ring-0">
      <h2 className="font-display text-sm font-bold">Atuação como modelo</h2>
      <div className="flex items-start gap-3">
        <Checkbox
          id="pf-atuacao-modelo"
          checked={disponivelComoModelo}
          onCheckedChange={(v) => setModelo(v === true)}
          className="mt-0.5"
        />
        <div className="space-y-1">
          <Label htmlFor="pf-atuacao-modelo" className="cursor-pointer">
            Também estou disponível como modelo
          </Label>
          <p className="text-texto-secundario text-xs font-normal">
            Fotos/vídeos para marcas, sem precisar de canal próprio.
          </p>
        </div>
      </div>
      {disponivelComoModelo ? (
        <div className="space-y-2">
          <Label>Dias em que topa ensaios / gravações</Label>
          <div className="flex flex-wrap gap-2">
            {DIAS_SEMANA.map((dia) => {
              const ativo = dias.includes(dia.id);
              return (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => toggleDia(dia.id)}
                  className={cn(
                    "rounded-button border px-3 py-1.5 text-xs font-medium transition-colors",
                    ativo
                      ? "border-verde-neon bg-verde-carvao-escuro text-verde-neon"
                      : "border-cinza-200 bg-white hover:border-verde-neon/40",
                  )}
                  aria-pressed={ativo}
                >
                  {dia.labelCurto}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
