"use client";

import { useRef, useState } from "react";
import { Camera, Eye, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import {
  CampoTextoFiltrado,
  validarTextosLivresPortfolio,
} from "@/components/influenciador/portfolio/campo-texto-filtrado";
import { SecoesPerfilPortfolio } from "@/components/influenciador/portfolio/secoes-perfil-portfolio";
import { PortfolioView } from "@/components/influenciador/portfolio/portfolio-view";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
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
  videoApresentacao,
  type PortfolioInfluenciador,
  type RedeSocialPortfolio,
  type TrabalhoAnterior,
} from "@/lib/influenciador/portfolio-types";
import type { DiaSemana, Midia, TipoAtuacao } from "@/lib/types/influenciador";
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
    midias: portfolio.midias ?? [],
  };
}

function revokeSeBlob(url: string | null | undefined) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

export function PortfolioEditor({ inicial }: PortfolioEditorProps) {
  const [draft, setDraft] = useState<PortfolioInfluenciador>(() =>
    comTiposPadrao(inicial),
  );
  const [salvando, setSalvando] = useState(false);
  const [preview, setPreview] = useState(false);
  const [avisoSalvar, setAvisoSalvar] = useState(false);
  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const fotoCapaRef = useRef<HTMLInputElement>(null);
  const videoApresRef = useRef<HTMLInputElement>(null);

  function patch(partial: Partial<PortfolioInfluenciador>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function onFile(
    file: File | null,
    campo: "fotoPerfilUrl" | "fotoCapaUrl",
  ) {
    const atual = draft[campo];
    revokeSeBlob(atual);
    if (!file) {
      patch({ [campo]: null });
      return;
    }
    patch({ [campo]: URL.createObjectURL(file) });
  }

  function setVideoApresentacao(file: File | null) {
    const atual = videoApresentacao(draft.midias);
    revokeSeBlob(atual?.url);
    const semApres = draft.midias.filter((m) => m.categoria !== "apresentacao");
    if (!file) {
      patch({ midias: semApres });
      return;
    }
    const nova: Midia = {
      id: atual?.id ?? novoIdLocal("mid"),
      tipo: "video",
      url: URL.createObjectURL(file),
      legenda: atual?.legenda,
      categoria: "apresentacao",
    };
    patch({ midias: [...semApres, nova] });
  }

  function setLegendaApresentacao(legenda: string) {
    const atual = videoApresentacao(draft.midias);
    if (!atual) return;
    patch({
      midias: draft.midias.map((m) =>
        m.id === atual.id ? { ...m, legenda: legenda || undefined } : m,
      ),
    });
  }

  function midiaDoTrabalho(trab: TrabalhoAnterior): Midia | undefined {
    if (!trab.midiaId) return undefined;
    return draft.midias.find((m) => m.id === trab.midiaId);
  }

  function setMidiaTrabalho(
    trabId: string,
    file: File | null,
    tipo: Midia["tipo"],
  ) {
    const trab = draft.trabalhos.find((t) => t.id === trabId);
    if (!trab) return;
    const existente = midiaDoTrabalho(trab);
    revokeSeBlob(existente?.url);

    if (!file) {
      patch({
        midias: draft.midias.filter((m) => m.id !== existente?.id),
        trabalhos: draft.trabalhos.map((t) =>
          t.id === trabId ? { ...t, midiaId: undefined } : t,
        ),
      });
      return;
    }

    const midiaId = existente?.id ?? novoIdLocal("mid");
    const nova: Midia = {
      id: midiaId,
      tipo,
      url: URL.createObjectURL(file),
      legenda: existente?.legenda,
      categoria: "trabalho_anterior",
    };
    const midias = existente
      ? draft.midias.map((m) => (m.id === midiaId ? nova : m))
      : [...draft.midias, nova];
    patch({
      midias,
      trabalhos: draft.trabalhos.map((t) =>
        t.id === trabId ? { ...t, midiaId } : t,
      ),
    });
  }

  function setLegendaTrabalho(trabId: string, legenda: string) {
    const trab = draft.trabalhos.find((t) => t.id === trabId);
    const midia = trab ? midiaDoTrabalho(trab) : undefined;
    if (!midia) return;
    patch({
      midias: draft.midias.map((m) =>
        m.id === midia.id ? { ...m, legenda: legenda || undefined } : m,
      ),
    });
  }

  function removerTrabalho(trabId: string) {
    const trab = draft.trabalhos.find((t) => t.id === trabId);
    const midia = trab ? midiaDoTrabalho(trab) : undefined;
    revokeSeBlob(midia?.url);
    patch({
      trabalhos: draft.trabalhos.filter((t) => t.id !== trabId),
      midias: midia
        ? draft.midias.filter((m) => m.id !== midia.id)
        : draft.midias,
    });
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

    const legendas = draft.midias.map((m) => m.legenda ?? "");
    const descricoesPacotes = draft.pacotes.map((p) => p.descricao);
    const validacao = validarTextosLivresPortfolio([
      draft.bio,
      ...legendas,
      ...descricoesPacotes,
    ]);
    if (!validacao.ok) {
      setAvisoSalvar(true);
      toast.error("Remova telefones, e-mails e @ dos textos do portfólio.");
      return;
    }
    setAvisoSalvar(false);

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
        midias: portfolio.midias,
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
    };
    patch({ redes: [...draft.redes, nova] });
  }

  function addTrabalho() {
    const novo: TrabalhoAnterior = {
      id: novoIdLocal("trab"),
      titulo: "",
      marca: "",
      tipoConteudo: "Reels",
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

  const apresentacao = videoApresentacao(draft.midias);

  if (preview) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-texto-secundario text-sm">
            Pré-visualização (como visitante — sem contatos externos)
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
            Edite sua vitrine pública com mídia própria, métricas e preços.
            Empresas veem esta página ao clicar no seu card na busca — sem links
            ou @ de outras redes.
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

      {avisoSalvar ? (
        <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
      ) : null}

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

      {/* Vídeo de apresentação */}
      <section className="secao-editavel space-y-4 ring-0">
        <div>
          <h2 className="font-display text-sm font-bold">
            Vídeo de apresentação
          </h2>
          <p className="text-texto-secundario mt-1 text-xs font-normal leading-relaxed">
            Um vídeo curto se apresentando para marcas — fale sobre seu
            trabalho, não inclua contatos pessoais
          </p>
        </div>
        <input
          ref={videoApresRef}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) =>
            setVideoApresentacao(e.target.files?.[0] ?? null)
          }
        />
        {apresentacao ? (
          <div className="space-y-3">
            <video
              src={apresentacao.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full overflow-hidden rounded-card bg-verde-carvao object-contain"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoApresRef.current?.click()}
              >
                Trocar vídeo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setVideoApresentacao(null)}
              >
                Remover
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Legenda (opcional)</Label>
              <CampoTextoFiltrado
                value={apresentacao.legenda ?? ""}
                onChange={setLegendaApresentacao}
                placeholder="Resumo curto — sem @ ou telefone"
              />
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => videoApresRef.current?.click()}
          >
            <Video className="size-4" aria-hidden />
            Enviar vídeo de apresentação
          </Button>
        )}
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
            <CampoTextoFiltrado
              id="pf-bio"
              value={draft.bio}
              onChange={(bio) => patch({ bio })}
              multiline
              rows={4}
            />
            <p className="text-texto-secundario text-xs">
              {draft.bio.length}/20 caracteres mínimos — sem @, telefone ou
              e-mail
            </p>
          </div>
        </div>
      </section>

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

      {/* Redes — só plataforma, sem @/handle */}
      <section className="secao-editavel space-y-4 ring-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-bold">Presença nas redes</h2>
            <p className="text-texto-secundario text-xs font-normal">
              Informe só a plataforma. Handles e links de perfil não entram na
              vitrine — o contato fica no chat filtrado.
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
              className="grid gap-2 rounded-card border border-cinza-200 p-3 sm:grid-cols-[1fr_auto]"
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
                    Object.keys(
                      LABELS_PLATAFORMA_REDE,
                    ) as RedeSocialPortfolio["plataforma"][]
                  ).map((key) => (
                    <SelectItem key={key} value={key}>
                      {LABELS_PLATAFORMA_REDE[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Trabalhos anteriores — mídia própria, sem link externo */}
      <section id="trabalhos" className="secao-editavel space-y-4 ring-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-bold">
              Trabalhos anteriores
            </h2>
            <p className="text-texto-secundario text-xs font-normal">
              Envie foto ou vídeo do trabalho. Sem links de redes sociais.
            </p>
          </div>
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
        <ul className="space-y-4">
          {draft.trabalhos.map((trab) => (
            <TrabalhoEditorItem
              key={trab.id}
              trab={trab}
              midia={midiaDoTrabalho(trab)}
              onPatchTrabalho={(partial) =>
                patch({
                  trabalhos: draft.trabalhos.map((t) =>
                    t.id === trab.id ? { ...t, ...partial } : t,
                  ),
                })
              }
              onMidia={(file, tipo) => setMidiaTrabalho(trab.id, file, tipo)}
              onLegenda={(legenda) => setLegendaTrabalho(trab.id, legenda)}
              onRemover={() => removerTrabalho(trab.id)}
            />
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

function TrabalhoEditorItem({
  trab,
  midia,
  onPatchTrabalho,
  onMidia,
  onLegenda,
  onRemover,
}: {
  trab: TrabalhoAnterior;
  midia: Midia | undefined;
  onPatchTrabalho: (partial: Partial<TrabalhoAnterior>) => void;
  onMidia: (file: File | null, tipo: Midia["tipo"]) => void;
  onLegenda: (legenda: string) => void;
  onRemover: () => void;
}) {
  const fotoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  return (
    <li className="space-y-3 rounded-card border border-cinza-200 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={trab.titulo}
            onChange={(e) => onPatchTrabalho({ titulo: e.target.value })}
            className="border-cinza-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Marca</Label>
          <Input
            value={trab.marca}
            onChange={(e) => onPatchTrabalho({ marca: e.target.value })}
            className="border-cinza-200 bg-white"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Tipo de conteúdo</Label>
          <Input
            value={trab.tipoConteudo}
            onChange={(e) => onPatchTrabalho({ tipoConteudo: e.target.value })}
            className="border-cinza-200 bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mídia do trabalho</Label>
        <input
          ref={fotoRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onMidia(e.target.files?.[0] ?? null, "foto")}
        />
        <input
          ref={videoRef}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => onMidia(e.target.files?.[0] ?? null, "video")}
        />
        {midia ? (
          <div className="space-y-2">
            {midia.tipo === "video" ? (
              <video
                src={midia.url}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full rounded-card bg-verde-carvao object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={midia.url}
                alt={midia.legenda || trab.titulo || "Trabalho"}
                className="aspect-video w-full rounded-card object-cover"
              />
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fotoRef.current?.click()}
              >
                Trocar foto
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoRef.current?.click()}
              >
                Trocar vídeo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onMidia(null, midia.tipo)}
              >
                Remover mídia
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Legenda curta (opcional)</Label>
              <CampoTextoFiltrado
                value={midia.legenda ?? ""}
                onChange={onLegenda}
                placeholder="Descreva o trabalho — sem @ ou telefone"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fotoRef.current?.click()}
            >
              <Camera className="size-4" aria-hidden />
              Enviar foto
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => videoRef.current?.click()}
            >
              <Video className="size-4" aria-hidden />
              Enviar vídeo
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemover}
          aria-label="Remover trabalho"
        >
          <Trash2 className="size-4" aria-hidden />
          Remover trabalho
        </Button>
      </div>
    </li>
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
