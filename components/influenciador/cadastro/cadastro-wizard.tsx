"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { PassoCategorias } from "@/components/influenciador/cadastro/passo-categorias";
import { PassoDadosBasicos } from "@/components/influenciador/cadastro/passo-dados-basicos";
import { PassoEquipamentosMetricas } from "@/components/influenciador/cadastro/passo-equipamentos-metricas";
import { PassoPacotesPrecificacao } from "@/components/influenciador/cadastro/passo-pacotes-precificacao";
import { PassoRevisaoPlano } from "@/components/influenciador/cadastro/passo-revisao-plano";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Stepper } from "@/components/ui/stepper";
import {
  CADASTRO_PASSOS,
  dadosDoPasso,
  type CadastroDraft,
} from "@/lib/influenciador/cadastro-types";
import { useAuth } from "@/lib/auth-context";
import {
  atualizarPrecosBase,
  calcularCompletudePerfil,
  criarEstadoInicial,
  montarPayload,
} from "@/lib/influenciador/cadastro-utils";
import { salvarPerfilInfluenciador } from "@/lib/influenciador/perfil-storage";
import { validarPassoCadastro } from "@/lib/schemas/influenciador-cadastro";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "influenciador-cadastro-rascunho";

function carregarRascunho(): CadastroDraft {
  if (typeof window === "undefined") return criarEstadoInicial();
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) return criarEstadoInicial();
    return { ...criarEstadoInicial(), ...JSON.parse(salvo) } as CadastroDraft;
  } catch {
    return criarEstadoInicial();
  }
}

function filtrarPacotesParaValidacao(draft: CadastroDraft): CadastroDraft {
  return {
    ...draft,
    pacotes: draft.pacotes.filter((p) => p.nome.trim().length > 0),
  };
}

export function CadastroWizard() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [draft, setDraft] = useState<CadastroDraft>(criarEstadoInicial);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(carregarRascunho());
    setHydrated(true);
  }, []);

  const salvarRascunho = useCallback((estado: CadastroDraft) => {
    const serializavel = { ...estado };
    delete (serializavel as Partial<CadastroDraft>).fotoPerfilUrl;
    delete (serializavel as Partial<CadastroDraft>).printMetricasUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializavel));
  }, []);

  const updateDraft = useCallback(
    (partial: Partial<CadastroDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...partial };
        salvarRascunho(next);
        return next;
      });
    },
    [salvarRascunho],
  );

  const focarPasso = useCallback(() => {
    stepRef.current?.focus();
  }, []);

  const validarEAvancar = useCallback(() => {
    const draftValidacao =
      currentStep === 3 ? filtrarPacotesParaValidacao(draft) : draft;
    const result = validarPassoCadastro(
      currentStep,
      dadosDoPasso(currentStep, draftValidacao),
    );

    if (!result.success) {
      setErrors(result.errors);
      toast.error("Revise os campos destacados antes de continuar.");
      return;
    }

    setErrors({});
    salvarRascunho(draft);

    const proximo = Math.min(currentStep + 1, CADASTRO_PASSOS.length - 1);

    setDraft((prev) => {
      const next =
        proximo === 3 && prev.seguidores !== ""
          ? {
              ...prev,
              tabelaPrecos: atualizarPrecosBase(
                prev.tabelaPrecos,
                prev.seguidores as number,
              ),
            }
          : prev;
      salvarRascunho(next);
      return next;
    });

    setCurrentStep(proximo);
    focarPasso();
  }, [currentStep, draft, focarPasso, salvarRascunho]);

  const voltar = useCallback(() => {
    setErrors({});
    salvarRascunho(draft);
    setCurrentStep((s) => Math.max(s - 1, 0));
    focarPasso();
  }, [draft, focarPasso, salvarRascunho]);

  const irParaPasso = useCallback(
    (passo: number) => {
      setErrors({});
      setCurrentStep(passo);
      focarPasso();
    },
    [focarPasso],
  );

  const concluir = useCallback(() => {
    if (!usuario) return;

    const draftValidacao = filtrarPacotesParaValidacao(draft);
    const result = validarPassoCadastro(
      4,
      dadosDoPasso(4, draftValidacao),
    );

    if (!result.success) {
      setErrors(result.errors);
      toast.error("Selecione um plano antes de concluir.");
      return;
    }

    const payload = montarPayload(draftValidacao, usuario);
    salvarPerfilInfluenciador(usuario.id, payload);

    localStorage.removeItem(STORAGE_KEY);
    toast.success("Cadastro concluído! Bem-vindo à plataforma.");
    router.push("/inicio");
  }, [draft, router, usuario]);

  if (!hydrated) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center bg-fundo-pagina text-sm">
        Carregando rascunho...
      </div>
    );
  }

  const progresso = ((currentStep + 1) / CADASTRO_PASSOS.length) * 100;
  const isUltimoPasso = currentStep === CADASTRO_PASSOS.length - 1;
  const completude = calcularCompletudePerfil(draft);
  const perfilCompleto = completude >= 80;

  return (
    <div className="min-h-full bg-fundo-pagina">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-texto-secundario text-sm font-medium">
                Cadastro de influenciador
              </p>
              <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
                Monte seu perfil profissional
              </h1>
              <p className="text-texto-secundario mt-2 text-sm font-normal">
                Quanto mais completo, melhores oportunidades compatíveis você recebe
                com empresas.
              </p>
            </div>

            <div
              className={cn(
                "secao-editavel flex shrink-0 items-center gap-2 self-start px-3 py-2 ring-0",
                perfilCompleto && "border-lilas/40",
              )}
              aria-label={`Perfil ${completude}% completo`}
            >
              {perfilCompleto ? (
                <BadgeCheck
                  className="text-verde-neon size-4 shrink-0"
                  aria-hidden
                />
              ) : null}
              <div className="text-sm">
                <p className="font-medium">Completude do perfil</p>
                <p
                  className={cn(
                    "font-data text-lg font-bold leading-tight",
                    perfilCompleto ? "text-verde-neon" : "text-lilas-escuro",
                  )}
                >
                  {completude}%
                </p>
              </div>
            </div>
          </div>

          <Progress value={progresso} aria-label="Progresso do cadastro">
            <div className="flex w-full items-center justify-between gap-2">
              <ProgressLabel>
                Passo {currentStep + 1} de {CADASTRO_PASSOS.length}
              </ProgressLabel>
              <span className="text-texto-secundario font-data text-sm">
                {CADASTRO_PASSOS[currentStep]?.label}
              </span>
            </div>
          </Progress>

          <Stepper
            steps={[...CADASTRO_PASSOS]}
            currentStep={currentStep}
            className="hidden sm:block"
          />
        </header>

        <div
          ref={stepRef}
          tabIndex={-1}
          className="outline-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {errors.root ? (
            <p role="alert" className="text-destructive mb-4 text-sm">
              {errors.root}
            </p>
          ) : null}

          {currentStep === 0 && (
            <PassoDadosBasicos
              draft={draft}
              onChange={updateDraft}
              errors={errors}
            />
          )}
          {currentStep === 1 && (
            <PassoCategorias
              draft={draft}
              onChange={updateDraft}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <PassoEquipamentosMetricas
              draft={draft}
              onChange={updateDraft}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <PassoPacotesPrecificacao
              draft={draft}
              onChange={updateDraft}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <PassoRevisaoPlano
              draft={draft}
              onChange={updateDraft}
              onEditarPasso={irParaPasso}
              errors={errors}
            />
          )}
        </div>

        <footer className="border-border mt-10 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={voltar}
            disabled={currentStep === 0}
            className="w-full sm:w-auto"
          >
            Voltar
          </Button>

          {isUltimoPasso ? (
            <Button
              type="button"
              variant="cta"
              onClick={concluir}
              className="w-full sm:w-auto"
            >
              Concluir cadastro
            </Button>
          ) : (
            <Button
              type="button"
              variant="cta"
              onClick={validarEAvancar}
              className="w-full sm:w-auto"
            >
              Continuar
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
