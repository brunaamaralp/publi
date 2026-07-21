"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PassoCategorias } from "@/components/influenciador/cadastro/passo-categorias";
import { PassoDadosBasicos } from "@/components/influenciador/cadastro/passo-dados-basicos";
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
  criarEstadoInicial,
  montarPayload,
} from "@/lib/influenciador/cadastro-utils";
import {
  carregarPerfilInfluenciador,
  salvarPerfilInfluenciador,
} from "@/lib/influenciador/perfil-storage";
import { obterOuCriarPortfolioDoUsuario } from "@/lib/influenciador/portfolio-storage";
import { definirStatusConta } from "@/lib/mock-data/influenciadores-status";
import { validarPassoCadastro } from "@/lib/schemas/influenciador-cadastro";

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

  const concluir = useCallback(() => {
    if (!usuario) return;

    const result = validarPassoCadastro(1, dadosDoPasso(1, draft));
    if (!result.success) {
      setErrors(result.errors);
      toast.error("Revise as áreas de domínio antes de continuar.");
      return;
    }

    const existente = carregarPerfilInfluenciador(usuario.id);
    const payload = montarPayload(draft, usuario, existente);
    salvarPerfilInfluenciador(usuario.id, payload);
    definirStatusConta(
      [usuario.id, payload.influenciador.id],
      "pendente_verificacao",
    );
    obterOuCriarPortfolioDoUsuario(usuario.id);

    localStorage.removeItem(STORAGE_KEY);
    toast.success(
      "Conta criada! Complete métricas e preços quando quiser — você já pode usar o app.",
    );
    router.push("/inicio");
  }, [draft, router, usuario]);

  const validarEAvancar = useCallback(() => {
    const result = validarPassoCadastro(
      currentStep,
      dadosDoPasso(currentStep, draft),
    );

    if (!result.success) {
      setErrors(result.errors);
      toast.error("Revise os campos destacados antes de continuar.");
      return;
    }

    setErrors({});
    salvarRascunho(draft);

    if (currentStep >= CADASTRO_PASSOS.length - 1) {
      concluir();
      return;
    }

    setCurrentStep((s) => s + 1);
    focarPasso();
  }, [concluir, currentStep, draft, focarPasso, salvarRascunho]);

  const voltar = useCallback(() => {
    setErrors({});
    salvarRascunho(draft);
    setCurrentStep((s) => Math.max(s - 1, 0));
    focarPasso();
  }, [draft, focarPasso, salvarRascunho]);

  if (!hydrated) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center bg-fundo-pagina text-sm">
        Carregando rascunho...
      </div>
    );
  }

  const progresso = ((currentStep + 1) / CADASTRO_PASSOS.length) * 100;
  const isUltimoPasso = currentStep === CADASTRO_PASSOS.length - 1;

  return (
    <div className="min-h-full bg-fundo-pagina">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-8 space-y-4">
          <div>
            <p className="text-texto-secundario text-sm font-medium">
              Cadastro de influenciador
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
              Crie sua conta
            </h1>
            <p className="text-texto-secundario mt-2 text-sm font-normal">
              Só o essencial agora. Métricas, preços e plano você completa
              depois, já dentro do app.
            </p>
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

          <Button
            type="button"
            variant="cta"
            onClick={validarEAvancar}
            className="w-full sm:w-auto"
          >
            {isUltimoPasso ? "Criar conta e entrar" : "Continuar"}
          </Button>
        </footer>
      </div>
    </div>
  );
}
