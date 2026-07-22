"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import {
  checklistPerfilIncompleto,
  perfilTemPendencias,
  type ItemChecklistPerfil,
} from "@/lib/influenciador/perfil-storage";
import {
  concluirOnboardingGuia,
  deveMostrarOnboardingGuia,
  dispensarOnboardingGuia,
} from "@/lib/influenciador/onboarding-storage";
import { obterOuCriarPortfolioDoUsuario } from "@/lib/influenciador/portfolio-storage";
import { cn } from "@/lib/utils";

const PASSOS_GUIA: {
  id: string;
  titulo: string;
  descricao: string;
  href: string;
}[] = [
  {
    id: "metricas",
    titulo: "Métricas ou trabalhos",
    descricao: "Envie o print da audiência ou adicione trabalhos anteriores.",
    href: "/influenciador/meu-portfolio#metricas",
  },
  {
    id: "precos",
    titulo: "Pacotes e preços",
    descricao: "Defina o que você oferece e quanto cobra.",
    href: "/influenciador/meu-portfolio#precos",
  },
  {
    id: "trabalhos",
    titulo: "Um trabalho na vitrine",
    descricao: "Mostre um case com foto ou vídeo (aba Prova).",
    href: "/influenciador/meu-portfolio#trabalhos",
  },
];

/**
 * Guia pós-cadastro: 3 micro-tarefas. Dismissível — o banner do dashboard
 * continua como fallback.
 */
export function OnboardingCompletarPerfilDialog() {
  const { usuario } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [checklist, setChecklist] = useState<ItemChecklistPerfil[]>([]);
  const [temTrabalho, setTemTrabalho] = useState(false);

  useEffect(() => {
    if (!usuario || usuario.tipo !== "influenciador") {
      setAberto(false);
      return;
    }
    if (!deveMostrarOnboardingGuia(usuario.id)) {
      setAberto(false);
      return;
    }
    if (!perfilTemPendencias(usuario.id)) {
      concluirOnboardingGuia(usuario.id);
      setAberto(false);
      return;
    }
    const portfolio = obterOuCriarPortfolioDoUsuario(usuario.id);
    setTemTrabalho(
      portfolio.trabalhos.some((t) => t.titulo.trim() || t.marca.trim()),
    );
    setChecklist(checklistPerfilIncompleto(usuario.id));
    setAberto(true);
  }, [usuario]);

  function dispensar() {
    if (!usuario) return;
    dispensarOnboardingGuia(usuario.id);
    setAberto(false);
  }

  function passoCompleto(passoId: string): boolean {
    if (passoId === "trabalhos") return temTrabalho;
    return checklist.some((i) => i.id === passoId && i.completo);
  }

  if (!usuario) return null;

  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (!open) dispensar();
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Complete seu perfil em 3 passos
          </DialogTitle>
          <DialogDescription>
            Você já pode usar o app. Para aparecer nas buscas e liberar a
            análise, complete estas tarefas — pode fazer depois pelo banner do
            painel.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-3" aria-label="Passos para completar o perfil">
          {PASSOS_GUIA.map((passo, index) => {
            const feito = passoCompleto(passo.id);
            return (
              <li key={passo.id}>
                <Link
                  href={passo.href}
                  onClick={dispensar}
                  className={cn(
                    "flex items-start gap-3 rounded-card border border-cinza-200 bg-white p-3 transition-colors hover:bg-fundo-pagina",
                    feito && "opacity-70",
                  )}
                >
                  <span className="mt-0.5 shrink-0" aria-hidden>
                    {feito ? (
                      <CheckCircle2 className="text-verde-neon size-5" />
                    ) : (
                      <Circle className="text-texto-secundario size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 space-y-0.5">
                    <span className="font-display block text-sm font-bold">
                      {index + 1}. {passo.titulo}
                    </span>
                    <span className="text-texto-secundario block text-xs font-normal leading-relaxed">
                      {passo.descricao}
                    </span>
                  </span>
                  <ArrowRight
                    className="text-texto-secundario mt-1 size-4 shrink-0"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ol>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="ghost" onClick={dispensar}>
            Fazer depois
          </Button>
          <Link
            href="/influenciador/meu-portfolio#metricas"
            onClick={dispensar}
            className={cn(buttonVariants({ variant: "cta" }), "inline-flex")}
          >
            Começar agora
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
